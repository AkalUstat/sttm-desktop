import React from 'react';
import PropTypes from 'prop-types';
import { useStoreActions, useStoreState } from 'easy-peasy';

import { DEFAULT_OVERLAY } from '../../common/constants';

const ToolbarItem = ({ itemName }) => {
  const { overlayScreen } = useStoreState(state => state.app);
  const { setOverlayScreen } = useStoreActions(actions => actions.app);
  const isSelectedOverlay = overlayScreen === itemName;
  const isSyncOverlay = itemName === 'sync-button';

  return (
    <div
      id={`tool-${itemName}`}
      className="toolbar-item"
      onClick={() => {
        if (isSelectedOverlay) {
          return setOverlayScreen(DEFAULT_OVERLAY);
        }

        setOverlayScreen(itemName);
      }}
    >
      {isSyncOverlay && <div className="beta-label">BETA</div>}
    </div>
  );
};

ToolbarItem.propTypes = {
  itemName: PropTypes.string.isRequired,
};

export default ToolbarItem;
