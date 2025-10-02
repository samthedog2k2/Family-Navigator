{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  # The packages listed here will be available in your shell
  packages = with pkgs; [
    # For running the export script
    tree

    # For system administration (optional but useful)
    sudo
  ];
}
