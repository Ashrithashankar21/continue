# Moonshot

[Moonshot AI](https://platform.moonshot.cn/) provides high-quality large language model services with competitive pricing and excellent performance.

## Configuration

To use Moonshot AI models, you need to:

1. Get an API key from [Moonshot AI Platform](https://platform.moonshot.cn/)
2. Add the following configuration to your `config.json`:

```json
{
  "models": [
    {
      "title": "Moonshot",
      "provider": "moonshot",
      "model": "moonshot-v1-8k",
      "apiKey": "YOUR_API_KEY"
    }
  ]
}
```

## Available Models

Moonshot AI currently provides the following models:

- `moonshot-v1-8k`: Base model with 8K context window
- `moonshot-v1-32k`: Base model with 32K context window
- `moonshot-v1-128k`: Base model with 128K context window

## Configuration Options

| Option    | Description       | Default                       |
| --------- | ----------------- | ----------------------------- |
| `apiKey`  | Moonshot API key  | Required                      |
| `apiBase` | API base URL      | `https://api.moonshot.cn/v1/` |
| `model`   | Model name to use | `moonshot-v1-8k`              |

## Example

Here's a complete configuration example:

```json
{
  "models": [
    {
      "title": "Moonshot-8K",
      "provider": "moonshot",
      "model": "moonshot-v1-8k",
      "apiKey": "YOUR_API_KEY",
      "completionOptions": {
        "temperature": 0.7,
        "topP": 0.95,
        "maxTokens": 2048
      }
    }
  ]
}
```