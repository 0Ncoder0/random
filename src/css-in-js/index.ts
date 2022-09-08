import * as md5 from "md5-js";
import * as CSS from "csstype";
import _ from "lodash";

/**
 * @doc https://github.com/0Ncoder0/random/tree/develop/src/css-in-js
 */

export interface TStyled {
  [key: string]: TStyled | CSS.Properties;
}
export type Styled = TStyled | CSS.Properties;

export default class CssInJs {
  /** 缓存样式的哈希值与类名的映射，若哈希值存在，则直接返回类名 */
  private static hash2class = new Map<string, string>([]);

  private static prefix = "css-in-js";
  private static style = (() => {
    const style = document.createElement("style");
    document.head.appendChild(style);
    style.setAttribute(CssInJs.prefix, "");
    return style;
  })();

  /**
   * 根据选择器和样式生成 css 内容
   */
  private static style2css = (selector: string, props: CSS.Properties) => {
    const cssProps = Object.keys(props).map(key => `\t${_.kebabCase(key)}:${props[key]};`);
    return [`${selector} {`, ...cssProps, "}"].join("\n");
  };

  /**
   * 链接选择器
   */
  private static linkSelector = (...selectors: string[]) => {
    const isPseudoClass = (selector: string) => /^:.+/.test(selector);
    return selectors
      .map(selector => {
        if (isPseudoClass(selector)) return selector;
        return " " + selector;
      })
      .join("");
  };

  /**
   * 随机生成一个CSS类名
   * @todo 去重
   */
  private static randomClassName = () => {
    const hash = md5(String(Math.random())).slice(-6);
    return `${CssInJs.prefix}-${hash}`;
  };

  /**
   * 新增样式代码
   * @todo 修改HTML或者新增DOM中选择消耗较小的那个（降低新增样式的成本）
   */
  private static appendStyle = (style: string) => {
    CssInJs.style.innerHTML += style;
  };

  /** 递归处理 Styled 对象，生存样式 */
  private static _styled = (selector: string, styled: Styled): string => {
    /** 样式属性 */
    const cssProps: CSS.Properties = {};
    /** 子元素 */
    const subSelector: string[] = [];

    /** 分离子元素和样式属性 */
    Object.keys(styled).forEach(key => {
      if (_.isObject(styled[key])) {
        subSelector.push(key);
      } else {
        cssProps[key] = styled[key];
      }
    });

    const style: string = CssInJs.style2css(selector, cssProps);
    const styles: string[] = subSelector.map(sub =>
      CssInJs._styled(CssInJs.linkSelector(selector, sub), styled[sub] as Styled)
    );

    return [style, ...styles].join("\n");
  };

  public static styled = (styled: Styled, className = CssInJs.randomClassName()) => {
    const hash = md5(styled);
    const exist = CssInJs.hash2class.get(hash);
    if (exist) return exist;

    const css: string = CssInJs._styled(`.${className}`, styled);
    CssInJs.appendStyle(css);
    CssInJs.hash2class.set(hash, className);
    return className;
  };
}

export const styled = CssInJs.styled;
