import { formatYuan } from "./format";

const Yuan: React.FC<{ children: string | number }> = ({ children }) => {
  return <span>{formatYuan(children)}</span>;
};

export default Yuan;
