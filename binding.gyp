{
  'variables': {
    'arch': '<!(node -p "process.arch")',
  },
  'targets': [
    {
      'target_name': 'addon',
      'sources': [
        './src/addon.cc'
      ],
      'include_dirs': [
        # On Windows: Cannot open include file: 'napi.h': No such file or directory
        # '<!@(node -p \'require("node-addon-api").include\')',
        'node_modules/node-addon-api',
      ],
      'cflags': [
        '-Wall',
        '-Wextra',
      ],
      'cflags!': [
        '-fno-exceptions',
      ],
      'cflags_cc!': [
        '-fno-exceptions',
      ],
      'defines': [
        'NAPI_VERSION=3',
      ],
      'conditions': [
        ['arch in ("arm64","ppc64","x64")',
          # For known 64-bit architectures, use the implementation optimized for 64-bit CPUs.
          {
            'sources': [
              './src/libkeccak-64/KeccakSpongeWidth1600.c',
              './src/libkeccak-64/KeccakP-1600-opt64.c',
            ],
            'defines': [
              'LIBKECCAK=64',
            ],
          },
          # Otherwise, use the implementation optimized for 32-bit CPUs.
          {
            'sources': [
              './src/libkeccak-32/KeccakSpongeWidth1600.c',
              './src/libkeccak-32/KeccakP-1600-inplace32BI.c',
            ],
            'defines': [
              'LIBKECCAK=32',
            ],
          },
        ],
      ],
      'xcode_settings': {
        'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
        'CLANG_CXX_LIBRARY': 'libc++',
        'MACOSX_DEPLOYMENT_TARGET': '10.7',
      },
      'msvs_settings': {
        'VCCLCompilerTool': {
          'ExceptionHandling': 1,
        },
      },
    }
  ]
}
