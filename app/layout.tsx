import "./globals.css";
import AppNav from "./AppNav";
export const metadata={title:"Hệ thống hỗ trợ CNTT Vinatex Đà Nẵng",description:"Cổng hỗ trợ CNTT Vinatex Đà Nẵng"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="vi"><body><AppNav/>{children}</body></html>}
