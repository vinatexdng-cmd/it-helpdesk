import "./globals.css";
import AppNav from "./AppNav";
export const metadata={title:"Vinatex IT Helpdesk",description:"Cổng hỗ trợ IT, Knowledge Base, Scripts và Case xử lý sự cố"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi"><body><AppNav/>{children}</body></html>}
