{
  description = "xHain website development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {
          inherit system;
        };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            hugo
            nodejs # For any potential Node.js dependencies
            go
          ];

          shellHook = ''
            echo "xHain website development environment"
            echo "Hugo version: $(hugo version)"
          '';
        };
      }
    );
}
