from services.ai_processor import process_issue_text

if __name__ == "__main__":
    sample_text = "The water supply has been cut for 3 days in my cell."
    result = process_issue_text(sample_text)
    print(result)