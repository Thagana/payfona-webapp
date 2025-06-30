{pkgs}: {
  channel = "stable-24.05";
  packages = [
    pkgs.nodejs_20
    pkgs.yarn
  ];
  idx.extensions = [
    "svelte.svelte-vscode"
    "vue.volar"
    "Tomi.xajssnippets"
  ];
  idx.previews = {
    previews = {
      web = {
        command = [
          "yarn"
          "dev"
          "--port"
          "$PORT"
          "--host"
          "0.0.0.0"
        ];
        manager = "web";
      };
    };
  };
}