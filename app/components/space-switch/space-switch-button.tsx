import { useState } from "react";
import { Link, useNavigate, useNavigation } from "react-router";
import { Button } from "~/components/ui/button";
import SpaceIntroDialog, {
  type SpaceIntro,
} from "~/components/space-switch/space-intro-dialog";
import SpaceSwitchOverlay from "~/components/space-switch/space-switch-overlay";
import {
  hasSeenSpaceIntro,
  markSpaceIntroSeen,
} from "~/components/space-switch/space-switch-storage";

export type SpaceSwitchFooter = {
  to: string;
  label: string;
  className: string;
  spaceId: string;
  switchingLabel: string;
  intro?: SpaceIntro;
};

export default function SpaceSwitchButton({
  to,
  label,
  className,
  spaceId,
  switchingLabel,
  intro,
}: SpaceSwitchFooter) {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const [introOpen, setIntroOpen] = useState(false);

  const isSwitching =
    navigation.state === "loading" && navigation.location?.pathname === to;

  const isPlainClick = (event: React.MouseEvent) =>
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey;

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!intro || !isPlainClick(event) || hasSeenSpaceIntro(spaceId)) return;

    event.preventDefault();
    setIntroOpen(true);
  };

  /* Only going through with the switch counts as having seen the primer.
     Dismissing it — X, Esc, a click outside — leaves the user where they were,
     so the next attempt to switch explains the space again. */
  const handleConfirm = () => {
    markSpaceIntroSeen(spaceId);
    setIntroOpen(false);
    navigate(to);
  };

  return (
    <>
      <Button
        asChild
        className={`mb-5 h-12 w-full rounded-xl text-sm font-bold text-white ${className}`}
      >
        <Link to={to} onClick={handleClick}>
          {label}
        </Link>
      </Button>

      {intro && (
        <SpaceIntroDialog
          intro={intro}
          open={introOpen}
          onOpenChange={setIntroOpen}
          onConfirm={handleConfirm}
        />
      )}

      {isSwitching && <SpaceSwitchOverlay label={switchingLabel} />}
    </>
  );
}
