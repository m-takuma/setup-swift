# setup-swift

## Basic usage
```yml
steps:
  - name: Checkout
    uses: actions/checkout@v4
  - name: Setup Swift
    uses: m-takuma/setup-swift@1
```

## Usage (Specific Version)
```yml
steps:
  - name: Checkout
    uses: actions/checkout@v4
  - name: Setup Swift
    uses: m-takuma/setup-swift@1
    with:
      swift-version: "5.10.1"
```
