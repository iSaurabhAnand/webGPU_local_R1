# webGPU_local_R1

Local DeepSeek Chat

A browser-based chat interface that runs the DeepSeek-R1-Distill-Qwen-1.5B-ONNX model locally using WebGPU technology. This project enables AI-powered conversations directly in your browser without requiring an internet connection for inference.

## Features

- Local execution using browser's GPU
- Real-time streaming responses
- Offline capability after initial model download

## Technical Stack

- WebGPU for GPU acceleration
- Hugging Face Transformers.js
- ONNX Runtime Web
- Markdown-it for text formatting
- Vite as build tool

## Requirements

- WebGPU-capable browser
- Sufficient GPU memory
- Local storage for model files

## Installation

```bash
# Clone the repository
git clone https://github.com/iSaurabhAnand/webGPU_local_R1.git

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Usage

1. Launch the application in a WebGPU-enabled browser
2. Wait for the initial model loading (indicated by loading spinner)
3. Type your question in the input field
4. Press Enter or click Send to get a response

## Benefits

- Privacy: All processing happens locally
- No latency: Direct GPU access
- Offline capability: No internet needed after setup
- Resource efficient: Optimized model (q4f16)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

Citations:
[1] https://github.com/huggingface/transformers.js-examples/tree/main/deepseek-r1-webgpu
[2] https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B
[3] https://huggingface.co/onnx-community/DeepSeek-R1-Distill-Qwen-1.5B-ONNX