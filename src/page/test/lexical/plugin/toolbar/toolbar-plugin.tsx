import HeadingToolbarPlugin from "./heading-toolbar-plugin";
import ListToolbarPlugin from "./list-toolbar-plugin";
import ToolbarBannerPlugin from "./toolbar-banner-plugin";

export default function ToolbarPlugin() {
    return (
        <div>
            <ListToolbarPlugin />
            <HeadingToolbarPlugin />
            <ToolbarBannerPlugin />
        </div>
    );
}
