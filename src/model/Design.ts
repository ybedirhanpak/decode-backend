type LayerType = "frame" | "text" | "image" | "icon" | "vector" | "group";

interface LayerProperties {
    // Positioning
    x?: number;
    y?: number;
    position?: "absolute" | "relative" | "fixed";
    zIndex?: number;

    // Sizing
    width: number | "auto";
    height: number | "auto";
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;

    // Layout (Auto Layout)
    layoutMode?: "none" | "horizontal" | "vertical";
    primaryAxisAlignItems?: "start" | "center" | "end" | "space-between";
    counterAxisAlignItems?: "start" | "center" | "end" | "stretch";
    itemSpacing?: number;
    padding?: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
    gap?: number;

    // Styling
    backgroundColor?: string;
    fills?: Array<{ color: string; type: "solid" | "gradient" | "image" }>;
    border?: {
        width: number;
        color: string;
        type: "solid" | "dashed" | "dotted";
    };
    borderRadius?: number | {
        topLeft?: number;
        topRight?: number;
        bottomLeft?: number;
        bottomRight?: number;
    };
    effects?: Array<{
        type: "shadow" | "blur";
        x: number;
        y: number;
        blur: number;
        spread?: number;
        color?: string;
    }>;

    // Text-Specific Properties
    font?: {
        family?: string;
        size?: number;
        weight?: number | string;
        style?: "normal" | "italic";
        lineHeight?: number | "auto";
        letterSpacing?: number;
        decoration?: "none" | "underline" | "line-through";
        alignment?: "left" | "center" | "right" | "justify";
    };
    textColor?: string;

    // Interactions
    cursor?: "default" | "pointer" | "text" | "move";
    visible?: boolean;

    // Advanced Features
    overflow?: "visible" | "hidden" | "scroll" | "auto";
    rotation?: number;
    opacity?: number;
    name?: string;
}

interface Layer {
    id: string; // Unique ID for the layer (matches design tool convention)
    name: string;
    type: LayerType;
    properties: LayerProperties;
    children?: Layer[];
}

interface DesignComponentVariant {
    name: string; // Variant name, e.g., "primary", "secondary", "tertiary", "disabled"
    layerOverrides: Array<{
        layerId: string; // ID of the layer being overridden
        properties: Partial<LayerProperties>; // Properties to override for the layer
    }>;
}

interface DesignComponentState {
    name: string; // State name, e.g., "hover", "focused", "pressed"
    layerOverrides: Array<{
        layerId: string; // ID of the layer being overridden
        properties: Partial<LayerProperties>; // Properties to override for the layer
    }>;
}

interface DesignComponent {
    id: string; // Unique component ID
    name: string; // Component name
    layers: Layer[];
    variants?: DesignComponentVariant[];
    states?: DesignComponentState[];
}

export type {
    DesignComponent
};
