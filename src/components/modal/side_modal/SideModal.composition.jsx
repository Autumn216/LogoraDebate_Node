import React from "react";
import { SideModal } from "./SideModal";
import { IntlProvider } from "react-intl";
import { ModalProvider } from "@logora/debate.dialog.modal";

const debateName = "Example Debate";
const debatePositions = [
  { id: 1, name: "Position A" },
  { id: 2, name: "Position B" },
  { id: 3, name: "Position C" },
];

export const SideModalExample = () => {
  const disabledPositions = [];

  const handleChooseSide = (positionId) => {
    console.log(`Selected position: ${positionId}`);
  };

  return (
    <>
      <ModalProvider>
        <IntlProvider locale="en">
          <SideModal
            debateName={debateName}
            debatePositions={debatePositions}
            disabledPositions={disabledPositions}
            onChooseSide={handleChooseSide}
            isNeutral={false}
          />
        </IntlProvider>
      </ModalProvider>
    </>
  );
};

export const SideModalWithNeutralPosition = () => {
  const disabledPositions = [];

  const handleChooseSide = (positionId) => {
    console.log(`Selected position: ${positionId}`);
  };

  return (
    <>
      <ModalProvider>
        <IntlProvider locale="en">
          <SideModal
            debateName={debateName}
            debatePositions={debatePositions}
            disabledPositions={disabledPositions}
            onChooseSide={handleChooseSide}
            isNeutral={true}
          />
        </IntlProvider>
      </ModalProvider>
    </>
  );
};


export const SideModalWithDisabledPositions = () => {
  const disabledPositions = [{ id: 2, name: "Position B" }];

  const handleChooseSide = (positionId) => {
    console.log(`Selected position: ${positionId}`);
  };

  return (
    <>
      <ModalProvider>
        <IntlProvider locale="en">
          <SideModal
            debateName={debateName}
            debatePositions={debatePositions}
            disabledPositions={disabledPositions}
            onChooseSide={handleChooseSide}
            isNeutral={false}
          />
        </IntlProvider>
      </ModalProvider>
    </>
  );
};

