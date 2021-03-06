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
      if (!model.isAutonomous) continue;
      moduleLinks.push({
        label: model.label,
        icon: model.icon,
        path: `/_/${moduleName}/${model.name}`,
      });
    }
    nav.push({
      label: mod.label,
      icon: mod.icon,
      children: moduleLinks,
    });
  }

  return nav;
};
