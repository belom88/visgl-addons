# Publish packages

## VehicleLayer

- Make a PR with update of the package version in `packages\vehicle-layer\package.json`;
- Merge a PR with message "vX.Y.Z";
- Create a tag `git tag -a vX.Y.Z -m "vX.Y.Z"`;
- Push the tag `git push origin vX.Y.Z`;
- Build the package `yarn nx run vehicle-layer:build --configuration=production`;
- Move to the dist folder `cd dist/packages/vehicle-layer`;
- Check npm login `npm whoami`;
- Publich version `npm publish`