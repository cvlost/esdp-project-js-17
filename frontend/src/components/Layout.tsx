import React, { PropsWithChildren, ReactNode } from 'react';
import AppToolbar from './AppToolbar/AppToolbar';

interface Props extends PropsWithChildren {
  children: ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <AppToolbar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
