# webpack-vendor-dll

Build app and vendor separately to optimize app build.

1. build vendor chunk
1. pick up vendor entries from vendor chunk
1. generate webpack config with vendor entries to build DLL
1. build DLL
1. build APP using DLL manifest
