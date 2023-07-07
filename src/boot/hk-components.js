import HkTable from "../components/hk-components/hk-table";
import HkCard from "../components/hk-components/hk-card";
import HkCardDeck from "../components/hk-components/hk-card-deck";
import HkShowKeybind from "../components/hk-components/hk-show-keybind";
import HkRoll from "../components/hk-components/hk-roll";
import HkRollAction from "../components/hk-components/hk-action-rolls/hk-roll-action";
import HkAnimatedInteger from "../components/hk-components/hk-animated-integer";
import HkDiceText from "../components/hk-components/hk-dice-text";
import HkPopover from "../components/hk-components/hk-popover";
import HkLoader from "../components/hk-components/hk-loader";
import HkDmgTypeSelect from "../components/hk-components/hk-dmg-type-select";
import HkTip from "../components/hk-components/hk-tip";
import HkTimer from "../components/hk-components/hk-timer";
import HkShare from "../components/hk-components/hk-share-button";
import HkImageUploader from "../components/hk-components/hk-image-uploader";
import HkBackgroundSelect from "../components/hk-components/hk-background-select";
import HkMarkdownEditor from "../components/hk-components/hk-markdown-editor";
import HkXpBar from "../components/hk-components/hk-xp-bar";
import HkLinkCharacter from "../components/hk-components/hk-link-character";
import HkActionRollForm from "../components/hk-components/hk-action-rolls/hk-action-roll-form";
import HkActionRollsTable from "../components/hk-components/hk-action-rolls/hk-action-rolls-table";
import HkActionRollScaling from "../components/hk-components/hk-action-rolls/hk-action-roll-scaling";
import HkPane from "../components/hk-components/hk-pane";

export default async ({ Vue }) => {
	Vue.component("hk-table", HkTable);
	Vue.component("hk-card", HkCard);
	Vue.component("hk-card-deck", HkCardDeck);
	Vue.component("hk-show-keybind", HkShowKeybind);
	Vue.component("hk-animated-integer", HkAnimatedInteger);
	Vue.component("hk-roll", HkRoll);
	Vue.component("hk-roll-action", HkRollAction);
	Vue.component("hk-loader", HkLoader);
	Vue.component("hk-dice-text", HkDiceText);
	Vue.component("hk-popover", HkPopover);
	Vue.component("hk-dmg-type-select", HkDmgTypeSelect);
	Vue.component("hk-tip", HkTip);
	Vue.component("hk-timer", HkTimer);
	Vue.component("hk-share", HkShare);
	Vue.component("hk-image-uploader", HkImageUploader);
	Vue.component("hk-background-select", HkBackgroundSelect);
	Vue.component("hk-markdown-editor", HkMarkdownEditor);
	Vue.component("hk-xp-bar", HkXpBar);
	Vue.component("hk-link-character", HkLinkCharacter);
	Vue.component("hk-action-roll-form", HkActionRollForm);
	Vue.component("hk-action-rolls-table", HkActionRollsTable);
	Vue.component("hk-action-roll-scaling", HkActionRollScaling);
	Vue.component("hk-pane", HkPane);
};
