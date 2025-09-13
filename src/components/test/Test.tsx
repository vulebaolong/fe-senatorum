import { ThemeToggleV1 } from "@/components/theme-toggle/theme-toggle-v1";
import Editor from "./lexical/editor";

export default function Test() {
    return (
        <div className="flex w-full h-[100dvh] items-center justify-center">
            {/* <ThemeToggleV1 /> */}
            <div className="relative w-full h-full m-10">
                <Editor />
            </div>
        </div>
    );
}
