use regex::Regex;
use serde::Serialize;
use std::{fs, io::Read, path::Path};
use walkdir::WalkDir;
use zip::ZipArchive;

#[derive(Serialize)]
struct ManuscriptDocument {
    id: String,
    title: String,
    path: String,
    text: String,
}

fn docx_text(path: &Path) -> Result<String, String> {
    let file = fs::File::open(path).map_err(|error| error.to_string())?;
    let mut archive = ZipArchive::new(file).map_err(|error| error.to_string())?;
    let mut xml = String::new();
    archive
        .by_name("word/document.xml")
        .map_err(|_| "The DOCX document body is missing.".to_string())?
        .read_to_string(&mut xml)
        .map_err(|error| error.to_string())?;
    let paragraph = Regex::new(r"</w:p>").map_err(|error| error.to_string())?;
    let tags = Regex::new(r"<[^>]+>").map_err(|error| error.to_string())?;
    let with_lines = paragraph.replace_all(&xml, "\n");
    Ok(tags
        .replace_all(&with_lines, "")
        .replace("&amp;", "&")
        .replace("&lt;", "<")
        .replace("&gt;", ">"))
}

#[tauri::command]
fn index_folder(path: String) -> Result<Vec<ManuscriptDocument>, String> {
    let root = Path::new(&path);
    if !root.is_dir() {
        return Err("The selected path is not a folder.".to_string());
    }
    index_documents(root)
}

fn index_documents(root: &Path) -> Result<Vec<ManuscriptDocument>, String> {
    let mut documents = Vec::new();
    for entry in WalkDir::new(root)
        .follow_links(false)
        .into_iter()
        .filter_map(Result::ok)
        .filter(|entry| entry.file_type().is_file())
    {
        let file_path = entry.path();
        let extension = file_path
            .extension()
            .and_then(|value| value.to_str())
            .unwrap_or("")
            .to_ascii_lowercase();
        if !matches!(extension.as_str(), "md" | "markdown" | "txt" | "docx") {
            continue;
        }
        let text = if extension == "docx" {
            docx_text(file_path).map_err(|error| format!("{}: {error}", file_path.display()))?
        } else {
            fs::read_to_string(file_path)
                .map_err(|error| format!("{}: {error}", file_path.display()))?
        };
        if text.trim().is_empty() {
            continue;
        }
        let relative = file_path.strip_prefix(root).unwrap_or(file_path).to_string_lossy().to_string();
        let title = file_path
            .file_stem()
            .and_then(|value| value.to_str())
            .unwrap_or("Untitled chapter")
            .to_string();
        documents.push(ManuscriptDocument {
            id: format!("file-{}", documents.len() + 1),
            title,
            path: relative,
            text,
        });
    }
    documents.sort_by(|left, right| left.path.cmp(&right.path));
    Ok(documents)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![index_folder])
        .run(tauri::generate_context!())
        .expect("error while running Manuscript Entity Indexer");
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn rejects_a_file_as_folder() {
        let result = index_folder("Cargo.toml".to_string());
        assert!(result.is_err());
    }

    #[test]
    fn indexes_supported_files_after_more_than_500_unsupported_entries() {
        let root = std::env::temp_dir().join(format!(
            "mei-walkdir-{}-{}",
            std::process::id(),
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .expect("clock before epoch")
                .as_nanos()
        ));
        fs::create_dir_all(&root).expect("create temporary manuscript folder");
        for number in 0..501 {
            fs::write(root.join(format!("note-{number}.tmp")), "not a chapter")
                .expect("write unsupported file");
        }
        fs::write(root.join("chapter.md"), "Mara Venn entered Glass Harbor.")
            .expect("write supported chapter");

        let documents = index_documents(&root).expect("index supported chapter");
        assert_eq!(documents.len(), 1);
        assert_eq!(documents[0].path, "chapter.md");

        fs::remove_dir_all(root).expect("remove temporary manuscript folder");
    }
}
