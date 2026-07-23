/**
 * Ported from ant-design-pro-master/src/components/TagSelect
 * (used by list/search/{articles,projects,applications}). Original used
 * `createStyles` (antd-style) + `clsx`; neither is installed in admin, so
 * className composition is done with a plain template-string join and
 * styling is inlined.
 */
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Button, Tag } from "antd";
import React, { type FC, useMemo, useState } from "react";

const { CheckableTag } = Tag;

interface TagSelectOptionProps {
  value: string | number;
  style?: React.CSSProperties;
  checked?: boolean;
  onChange?: (value: string | number, state: boolean) => void;
  children?: React.ReactNode;
}
const TagSelectOption: React.FC<TagSelectOptionProps> & {
  isTagSelectOption: boolean;
} = ({ children, checked, onChange, value }) => (
  <CheckableTag
    checked={!!checked}
    key={value}
    onChange={(state) => onChange?.(value, state)}
  >
    {children}
  </CheckableTag>
);

TagSelectOption.isTagSelectOption = true;

type TagSelectOptionElement = React.ReactElement<
  TagSelectOptionProps,
  typeof TagSelectOption
>;

const isTagSelectOption = (node: TagSelectOptionElement) =>
  node?.type &&
  ((node.type as any).isTagSelectOption ||
    (node.type as any).displayName === "TagSelectOption");

interface TagSelectProps {
  onChange?: (value: (string | number)[]) => void;
  expandable?: boolean;
  value?: (string | number)[];
  defaultValue?: (string | number)[];
  style?: React.CSSProperties;
  hideCheckAll?: boolean;
  actionsText?: {
    expandText?: React.ReactNode;
    collapseText?: React.ReactNode;
    selectAllText?: React.ReactNode;
  };
  className?: string;
  children?: TagSelectOptionElement | TagSelectOptionElement[];
}
const TagSelect: FC<TagSelectProps> & {
  Option: typeof TagSelectOption;
} = (props) => {
  const {
    children,
    hideCheckAll = false,
    style,
    expandable,
    actionsText = {},
  } = props;
  const [expand, setExpand] = useState<boolean>(false);

  const [innerValue, setInnerValue] = useState<(string | number)[]>(
    props.defaultValue || [],
  );
  const value = props.value ?? innerValue;
  const setValue = (nextValue: (string | number)[]) => {
    if (props.value === undefined) {
      setInnerValue(() => nextValue);
    }
    props.onChange?.(nextValue);
  };

  const allTags = useMemo(() => {
    const childrenArray = React.Children.toArray(
      children,
    ) as TagSelectOptionElement[];
    return childrenArray.reduce<(string | number)[]>((acc, child) => {
      if (isTagSelectOption(child)) acc.push(child.props.value);
      return acc;
    }, []);
  }, [children]);

  const valueSet = useMemo(() => new Set(value || []), [value]);

  const onSelectAll = (checked: boolean) => {
    setValue(checked ? [...allTags] : []);
  };
  const handleTagChange = (tag: string | number, checked: boolean) => {
    const checkedTags = new Set(value || []);
    if (checked) {
      checkedTags.add(tag);
    } else {
      checkedTags.delete(tag);
    }
    setValue([...checkedTags]);
  };
  const checkedAll = allTags.length === value?.length && allTags.length > 0;
  const {
    expandText = "Expand",
    collapseText = "Collapse",
    selectAllText = "All",
  } = actionsText;

  return (
    <div
      style={{
        position: "relative",
        maxHeight: expand ? 200 : 32,
        marginLeft: -8,
        overflow: "hidden",
        lineHeight: "32px",
        transition: "all 0.3s",
        userSelect: "none",
        paddingRight: expandable ? 50 : undefined,
        ...style,
      }}
    >
      {hideCheckAll ? null : (
        <CheckableTag
          checked={checkedAll}
          key="tag-select-__all__"
          onChange={onSelectAll}
        >
          {selectAllText}
        </CheckableTag>
      )}
      {children &&
        React.Children.map(children, (child: TagSelectOptionElement) => {
          if (isTagSelectOption(child)) {
            return React.cloneElement(child, {
              key: `tag-select-${child.props.value}`,
              value: child.props.value,
              checked: valueSet.has(child.props.value),
              onChange: handleTagChange,
            });
          }
          return child;
        })}
      {expandable && (
        <Button
          type="link"
          style={{ position: "absolute", top: 0, right: 0 }}
          onClick={() => setExpand((prev) => !prev)}
        >
          {expand ? (
            <>
              {collapseText} <UpOutlined />
            </>
          ) : (
            <>
              {expandText}
              <DownOutlined />
            </>
          )}
        </Button>
      )}
    </div>
  );
};
TagSelect.Option = TagSelectOption;
export default TagSelect;
