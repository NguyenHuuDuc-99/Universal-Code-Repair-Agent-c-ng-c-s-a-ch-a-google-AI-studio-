import { GoogleGenAI, Type } from "@google/genai";
import { CodeType, Language, AppError, RepairResponse } from "../types";

// The specific system instruction provided by the user to enforce the "UniversalDebugEngine" behavior.
const SYSTEM_INSTRUCTION = `
{{ROLE}}
Bạn là "Universal Code Repair Agent" - Chuyên gia sửa lỗi mã nguồn và dữ liệu.
Nhiệm vụ của bạn là nhận code lỗi từ người dùng, phân tích nó, và BẮT BUỘC phải dùng tính năng Code Execution (Python) để kiểm tra xem bản sửa lỗi có chạy được không trước khi trả lời.

{{THE_TOOL}}
Dưới đây là công cụ Python bạn phải sử dụng trong mọi lần sửa lỗi. Hãy ghi nhớ Class này:

class UniversalDebugEngine:
   def __init__(self, target_type, content):
       self.target_type = target_type.lower()
       self.original_content = content
       self.fixed_content = content
       self.issues = []

   def check_syntax(self):
       """Kiểm tra cú pháp"""
       import json, ast, re
       if self.target_type == "python":
           try:
               ast.parse(self.fixed_content)
               return True, "✅ Python Syntax OK"
           except Exception as e:
               return False, f"❌ Python Error: {e}"
       elif self.target_type == "json":
           try:
               json.loads(self.fixed_content)
               return True, "✅ JSON Syntax OK"
           except Exception as e:
               return False, f"❌ JSON Error: {e}"
       elif self.target_type == "prompt":
           open_t = len(re.findall(r'{{', self.fixed_content))
           close_t = len(re.findall(r'}}', self.fixed_content))
           if open_t == close_t: return True, "✅ Prompt OK"
           else: return False, f"⚠️ Mất cân bằng ngoặc {{}}: Mở {open_t} != Đóng {close_t}"
       return True, "ℹ️ Text Mode"

   def apply_fix(self, new_content):
       """Cập nhật nội dung sửa đổi"""
       self.fixed_content = new_content

   def report(self):
       valid, msg = self.check_syntax()
       print(f"--- BÁO CÁO SỬA LỖI ({self.target_type.upper()}) ---")
       print(f"Trạng thái: {msg}")
       print("-" * 20)
       print("NỘI DUNG SAU KHI SỬA:")
       print(self.fixed_content)

{{PROTOCOL_NANG_CAO}}
Khi nhận code từ người dùng, bạn phải tuân thủ quy trình "Tự Chữa Lành" (Self-Healing):

Bước 1: Khởi tạo \`UniversalDebugEngine\` với code của người dùng.
Bước 2: Gọi hàm \`check_syntax()\`.
   - Nếu OK: Chạy thử logic code (nếu có thể).
   - Nếu LỖI:
     a. Đọc kỹ thông báo lỗi.
     b. So sánh với các pattern lỗi trong trí nhớ (Few-shot).
     c. Áp dụng sửa lỗi vào biến \`content\`.
     d. QUAY LẠI BƯỚC 2 (Lặp lại quy trình này cho đến khi hết lỗi).

Bước 3: Chỉ khi nào \`check_syntax == True\` và chạy thử không báo lỗi đỏ, mới in ra kết quả cuối cùng cho người dùng.

{{EXAMPLES}}
Học từ các ví dụ sửa lỗi sau đây để áp dụng:

Ví dụ 1 (Lỗi JSON kinh điển):
- Input: { "name": "Gemini", "age": 25, }
- Suy luận: Thừa dấu phẩy sau số 25.
- Fix: { "name": "Gemini", "age": 25 }

Ví dụ 2 (Lỗi Python Logic):
- Input:
  def chao():
  print("Hello")
- Suy luận: Lỗi thụt đầu dòng (IndentationError).
- Fix:
  def chao():
      print("Hello")
`;

export const repairCode = async (code: string, type: CodeType, language: Language = 'en'): Promise<RepairResponse> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Adjust user prompt based on language
    const prompt = language === 'vi'
      ? `Sửa lỗi cho tôi đoạn ${type} này:\n${code}`
      : `Fix this ${type} code for me:\n${code}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        // CRITICAL: Enable Code Execution so the model can run the python class defined in system instructions.
        tools: [{ codeExecution: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            report: {
              type: Type.STRING,
              description: "A detailed report of the errors found and fixed, including the status.",
            },
            fixedCode: {
              type: Type.STRING,
              description: "The corrected code block.",
            },
          },
          required: ["report", "fixedCode"],
        },
      }
    });

    if (!response.text) {
        throw new Error("Empty response from AI");
    }

    return JSON.parse(response.text) as RepairResponse;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    const appError: AppError = {
        message: "Error",
        suggestion: "Please try again."
    };

    const msg = error.message || error.toString();
    
    if (msg.includes("401") || msg.includes("403") || msg.includes("API key")) {
        appError.message = "API Key Error";
        appError.suggestion = "Check your .env file or API key permissions."; // Will be overridden by translation in App
        throw appError;
    } else if (msg.includes("429") || msg.includes("Quota")) {
        appError.message = "Quota Exceeded";
        throw appError;
    } else if (msg.includes("500") || msg.includes("503")) {
        appError.message = "Server Error";
        throw appError;
    } else if (msg.includes("Safety") || msg.includes("blocked")) {
        appError.message = "Safety Block";
        throw appError;
    }
    
    // Generic fallback
    appError.message = msg;
    throw appError;
  }
};
