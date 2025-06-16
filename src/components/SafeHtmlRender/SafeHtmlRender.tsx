import parse, {
  domToReact,
  Element,
  HTMLReactParserOptions,
  attributesToProps,
  DOMNode,
} from "html-react-parser";
import DOMPurify from "dompurify";

const UNSAFE_TAGS = ["script", "iframe", "object", "embed", "style"];

/**
 * A safe wrapper around `domToReact` to satisfy strict TypeScript typing.
 * Ensures that children are cast correctly as DOMNode[].
 *
 * @param children - Child nodes of an HTML element
 * @param options - Parser options for html-react-parser
 * @returns React elements converted from DOM nodes
 */
function safeDomToReact(
  children: DOMNode[] | undefined,
  options?: HTMLReactParserOptions
) {
  return domToReact(children ?? [], options);
}

/**
 * Custom html-react-parser configuration.
 * This logic is based on official html-react-parser documentation:
 * https://github.com/remarkablemark/html-react-parser#replace
 *
 * It filters unsafe tags and maps common HTML tags to Tailwind-styled React components.
 */
const parserOptions: HTMLReactParserOptions = {
  replace(domNode) {
    if ((domNode as Element).type !== "tag") return;

    const el = domNode as Element;

    if (UNSAFE_TAGS.includes(el.name)) return <></>;

    const props = attributesToProps(el.attribs || {});
    const children = el.children as DOMNode[];

    switch (el.name) {
      case "strong":
      case "b":
        return (
          <strong className="font-semibold">
            {safeDomToReact(children, parserOptions)}
          </strong>
        );
      case "i":
        return (
          <span className="italic">
            {safeDomToReact(children, parserOptions)}
          </span>
        );
      case "u":
        return (
          <span className="underline">
            {safeDomToReact(children, parserOptions)}
          </span>
        );
      case "br":
        return <br />;
      case "p":
        return (
          <p className="mb-2">{safeDomToReact(children, parserOptions)}</p>
        );
      case "ul":
        return (
          <ul className="list-disc pl-4 mb-2">
            {safeDomToReact(children, parserOptions)}
          </ul>
        );
      case "li":
        return (
          <li className="mb-1">{safeDomToReact(children, parserOptions)}</li>
        );
      case "a":
        return (
          <a
            {...props}
            className="text-blue-600 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {safeDomToReact(children, parserOptions)}
          </a>
        );
      case "span":
      case "div":
        return (
          <span {...props}>{safeDomToReact(children, parserOptions)}</span>
        );
      default:
        return <>{safeDomToReact(children, parserOptions)}</>;
    }
  },
};

type Props = {
  html: string;
  className?: string;
};

/**
 * Renders sanitized HTML content using `html-react-parser` and `DOMPurify`.
 */
export const SafeHtmlRenderer = ({ html, className = "" }: Props) => {
  const cleanHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      {parse(cleanHtml, parserOptions)}
    </div>
  );
};
