import { Language } from "./types";

export const translations = {
  en: {
    appTitle: "Universal Code Repair Agent",
    appSubtitle: "Powered by Gemini 3 Flash & Python Code Execution",
    systemOnline: "System Online",
    inputTitle: "Input Broken Code",
    outputTitle: "Agent Report & Fixed Code",
    runRepair: "Run Repair",
    repairing: "Repairing...",
    example: "Example",
    clear: "Clear content",
    copy: "Copy to clipboard",
    repairFailed: "Repair Failed",
    dismiss: "Dismiss",
    outputPlaceholderLoading: "Agent is initializing UniversalDebugEngine...\nRunning syntax checks...\nExecuting python environment...",
    outputPlaceholderDefault: "The repair report and fixed code will appear here.",
    errorUnexpected: "An unexpected error occurred.",
    errorGemini: "Failed to repair code. Please check your API key and try again.",
    helpTitle: "System Protocol & Usage",
    helpDescription: "This agent follows a strict protocol to ensure code integrity:",
    helpSteps: [
      "1. Initializes the `UniversalDebugEngine` Python class.",
      "2. Analyzes the broken code input.",
      "3. Applies fixes and checks syntax internally.",
      "4. Executes the fixed code to verify correctness.",
      "5. Reports the final result."
    ],
    close: "Close",
    examples: {
      python: `def calculate_sum(a, b)\n    return a + b\n\nresult = calculate_sum(10, 20\nprint(f"Result is {result")`,
      json: `{\n  "id": 1,\n  "name": "Gemini",\n  "tags": ["AI", "Google",],\n  "active": true\n}`,
      prompt: `Hello {{name}}, welcome to our service.\nYour order {{order_id} is ready.\nPlease check your email.`
    },
    placeholders: {
      json: `Example broken JSON:\n{"name": "Gemini", "age": 25, "skills": ["Code", "Chat",],}`,
      python: `Example broken Python:\ndef hello()\n  print("Hello world"`,
      prompt: `Example broken Prompt:\n{{user_name}} welcome to the {{system_name`
    }
  },
  vi: {
    appTitle: "Trợ Lý Sửa Lỗi Vạn Năng",
    appSubtitle: "Được hỗ trợ bởi Gemini 3 Flash & Thực thi mã Python",
    systemOnline: "Hệ thống Online",
    inputTitle: "Nhập Code Lỗi",
    outputTitle: "Báo cáo & Code Đã Sửa",
    runRepair: "Sửa Lỗi Ngay",
    repairing: "Đang sửa...",
    example: "Mẫu thử",
    clear: "Xóa nội dung",
    copy: "Sao chép",
    repairFailed: "Sửa lỗi thất bại",
    dismiss: "Đóng",
    outputPlaceholderLoading: "Đang khởi tạo UniversalDebugEngine...\nĐang kiểm tra cú pháp...\nĐang thực thi môi trường Python...",
    outputPlaceholderDefault: "Báo cáo sửa lỗi và code hoàn chỉnh sẽ hiện ở đây.",
    errorUnexpected: "Đã xảy ra lỗi không mong muốn.",
    errorGemini: "Không thể sửa code. Vui lòng kiểm tra API key và thử lại.",
    helpTitle: "Giao Thức & Hướng Dẫn",
    helpDescription: "Agent tuân thủ quy trình nghiêm ngặt để đảm bảo độ chính xác:",
    helpSteps: [
      "1. Khởi tạo lớp Python `UniversalDebugEngine`.",
      "2. Phân tích đoạn code lỗi đầu vào.",
      "3. Áp dụng sửa lỗi và kiểm tra cú pháp.",
      "4. Chạy thực thi (Code Execution) để xác minh.",
      "5. Báo cáo kết quả cuối cùng."
    ],
    close: "Đóng",
    examples: {
      python: `def tinh_tong(a, b)\n    tra_ve a + b\n\nket_qua = tinh_tong(10, 20\nprint(f"Ket qua la {ket_qua")`,
      json: `{\n  "id": 1,\n  "ten": "Gemini",\n  "the": ["AI", "Google",],\n  "hoat_dong": true\n}`,
      prompt: `Xin chao {{ten}}, chao mung den voi dich vu.\nDon hang {{ma_don} da san sang.\nVui long kiem tra email.`
    },
    placeholders: {
      json: `Ví dụ JSON lỗi:\n{"ten": "Gemini", "tuoi": 25, "ky_nang": ["Code", "Chat",],}`,
      python: `Ví dụ Python lỗi:\ndef xin_chao()\n  print("Xin chao the gioi"`,
      prompt: `Ví dụ Prompt lỗi:\n{{ten_nguoi_dung}} chao mung den voi {{ten_he_thong`
    }
  }
};

export const getTranslation = (lang: Language) => translations[lang];
