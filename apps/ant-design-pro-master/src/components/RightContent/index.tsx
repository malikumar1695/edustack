import { BookOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { Button, Tooltip } from 'antd';
import React from 'react';
import useHeaderActionStyles from './style';
import { VersionDropdown } from './VersionDropdown';

export const DocLink: React.FC = () => {
  const { styles } = useHeaderActionStyles();
  return (
    <Tooltip title="Documentation">
      <Button
        type="text"
        className={styles.action}
        icon={<BookOutlined />}
        aria-label="Documentation"
        onClick={() => {
          history.push('/welcome');
        }}
      />
    </Tooltip>
  );
};

export { VersionDropdown };
