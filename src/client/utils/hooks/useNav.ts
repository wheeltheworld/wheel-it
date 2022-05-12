import useManifest from "./useManifest";

interface NavLink {
  label: string;
  icon?: string;
  path?: string;
  children?: NavLink[];
}

export const useNav = (): NavLink[] => {
  const { manifest } = useManifest();

  if (!manifest) return [];
  const nav: NavLink[] = [];

  for (const mod of Object.values(manifest.modules)) {
    const moduleName = mod.name;
    const moduleLinks: NavLink[] = [];
    for (const model of Object.values(mod.models)) {
      moduleLinks.push({
        label: model.name,
        icon: model.icon,
        path: `/_/${moduleName}/${model.name}`,
      });
    }
    nav.push({
      label: moduleName,
      icon: mod.icon,
      children: moduleLinks,
    });
  }

  return nav;
};
