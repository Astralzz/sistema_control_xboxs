import React from "react";
import * as icons from "react-bootstrap-icons";

// Props
interface IconProps extends icons.IconProps {
  nombre: keyof typeof icons;
}

// Todo, Icono bootstrap
const IconoBootstrap: React.FC<IconProps> = ({
  nombre: iconName,
  ...props
}) => {
  const BootstrapIcon = icons[iconName];
  return <BootstrapIcon className="icono" {...props} />;
};

export default IconoBootstrap;
