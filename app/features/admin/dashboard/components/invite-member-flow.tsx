import { useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router";

import { InviteMemberModal } from "~/features/admin/manage-moderator/components/invite-member-modal";
import { InviteSuccessModal } from "~/features/admin/manage-moderator/components/invite-success-modal";

interface InviteMemberFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InviteMemberFlow({ isOpen, onClose }: InviteMemberFlowProps) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [fetcherKey, setFetcherKey] = useState(0);
  const inviteFetcher = useFetcher({ key: `invite-flow-${fetcherKey}` });
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const inviteError =
    inviteFetcher.state === "idle" && inviteFetcher.data?.ok === false
      ? (inviteFetcher.data?.message ??
        "Failed to send invitation. Please try again.")
      : null;

  useEffect(() => {
    if (inviteFetcher.state === "idle" && inviteFetcher.data?.ok) {
      onCloseRef.current();
      setShowSuccessModal(true);
    }
  }, [inviteFetcher.data, inviteFetcher.state]);

  const handleSend = ({ email, role }: { email: string; role: string }) =>
    inviteFetcher.submit(
      { intent: "invite", email, role },
      {
        method: "post",
        action: "/tk-admin/manage-moderator/team",
        encType: "application/x-www-form-urlencoded",
      },
    );

  const handleClose = () => {
    setFetcherKey((k) => k + 1);
    onClose();
  };

  return (
    <>
      <InviteMemberModal
        isOpen={isOpen}
        onClose={handleClose}
        onSend={handleSend}
        isLoading={inviteFetcher.state !== "idle"}
        serverError={inviteError}
      />
      <InviteSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
}
