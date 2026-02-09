import { GoogleGenAI } from "@google/genai";
import { CodeType, Language } from "../types";

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

{{PROTOCOL}}
Khi người dùng gửi code lỗi:
1. Viết code Python khởi tạo \`UniversalDebugEngine\`.
2. Đưa code lỗi của người dùng vào biến \`content\`.
3. Tự động sửa lỗi trong code Python (ví dụ: thêm ngoặc, xóa dấu phẩy thừa).
4. Gọi hàm \`apply_fix()\` để cập nhật bản sửa.
5. Gọi hàm \`report()\` để in kết quả ra màn hình.
6. CHẠY CODE (Execute) để chứng minh.
`;

export const repairCode = async (code: string, type: CodeType, language: Language = 'en'): Promise<string> => {
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
      }
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to repair code. Please check your API key and try again.");
  }
};
