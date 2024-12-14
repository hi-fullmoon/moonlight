import { Content } from './Content';
import { Sider } from './Sider';
import InternalLayout from './Layout';

type CompoundedComponent = typeof InternalLayout & {
  Content: typeof Content;
  Sider: typeof Sider;
};

const Layout = InternalLayout as CompoundedComponent;

Layout.Content = Content;
Layout.Sider = Sider;

export { Layout };
