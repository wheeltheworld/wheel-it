import useManifest from "./useManifest";

interface NavLink {
  label: string;
  icon?: string;
  path: string;
}

interface NavLinks {
  [key: string]: {
    label: string;
    icon?: string;
    children: NavLink[];
  };
}

export const useNav = (): NavLinks => {
  const { manifest } = useManifest();

  if (!manifest) return {};
  const nav: NavLinks = {};

  for (const mod of Object.values(manifest.modules)) {
    const moduleName = mod.name;
    const moduleLinks: NavLink[] = [];
    for (const model of Object.values(mod.models)) {
      moduleLinks.push({
        label: model.name,
        path: `/_/${moduleName}/${model.name}`,
      });
    }
    nav[moduleName] = {
      label: moduleName,
      icon: mod.icon,
      children: moduleLinks,
    };
  }

  return nav;
};
