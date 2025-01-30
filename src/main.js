import { pipeline, TextStreamer } from '@huggingface/transformers';
import { Worker } from './worker.js';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

let generator;
const messagesEl = document.getElementById('messages');
const inputEl = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

let buffer = '';
let currentMessageDiv = null;
let currentThinkDiv = null;
let currentAnswerDiv = null;

async function initModel() {
    generator = await pipeline(
        'text-generation',
        'onnx-community/DeepSeek-R1-Distill-Qwen-1.5B-ONNX',
        {
            dtype: 'q4f16',
            device: 'webgpu'
        }
    );
}

function addUserMessage(content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user-message';
    messageDiv.textContent = content;
    messagesEl.appendChild(messageDiv);
    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function createBotMessageContainer() {
    currentMessageDiv = document.createElement('div');
    currentMessageDiv.className = 'message bot-message';
    currentMessageDiv.style.display = 'none';
    messagesEl.appendChild(currentMessageDiv);

    currentThinkDiv = document.createElement('div');
    currentThinkDiv.className = 'think-content';
    currentThinkDiv.style.display = 'none';
    currentMessageDiv.appendChild(currentThinkDiv);

    currentAnswerDiv = document.createElement('div');
    currentAnswerDiv.className = 'answer-content';
    currentAnswerDiv.style.display = 'none';
    currentMessageDiv.appendChild(currentAnswerDiv);
}

function updatePartialText(partialText) {
    if (!currentMessageDiv) {
        createBotMessageContainer();
    }

    currentMessageDiv.style.display = 'block';

    if (partialText.includes('<think>')) {
        const parts = partialText.split('</think>');
        const thinkContent = parts[0].replace('<think>', '').trim();
        if (thinkContent) {
            currentThinkDiv.innerHTML = md.render(thinkContent);
            currentThinkDiv.style.display = 'block';
        }

        if (parts.length > 1) {
            const answerContent = parts[1].trim();
            if (answerContent) {
                currentAnswerDiv.innerHTML = md.render(answerContent);
                currentAnswerDiv.style.display = 'block';
            }
        }
    } else {
        currentAnswerDiv.innerHTML = md.render(partialText);
        currentAnswerDiv.style.display = 'block';
    }

    messagesEl.scrollTop = messagesEl.scrollHeight;
}

function processCompleteResponse(completeText) {
    const thinkMatch = completeText.match(/<think>(.*?)<\/think>/s);
    const answerMatch = completeText.match(/<\/think>(.*)/s);
    
    if (thinkMatch && answerMatch) {
        const thinking = thinkMatch[1].trim();
        const answer = answerMatch[1].trim();
        
        if (thinking) {
            currentThinkDiv.innerHTML = md.render(thinking);
            currentThinkDiv.style.display = 'block';
        } else {
            currentThinkDiv.style.display = 'none';
        }
        currentAnswerDiv.innerHTML = md.render(answer);
        currentAnswerDiv.style.display = 'block';
    } else {
        currentThinkDiv.style.display = 'none';
        currentAnswerDiv.innerHTML = md.render(completeText);
        currentAnswerDiv.style.display = 'block';
    }

    messagesEl.scrollTop = messagesEl.scrollHeight;
    currentMessageDiv = null;
    currentThinkDiv = null;
    currentAnswerDiv = null;
}

async function handleSend() {
    const prompt = inputEl.value.trim();
    if (!prompt) return;
    
    inputEl.value = '';
    addUserMessage(prompt);
    
    buffer = '';
    createBotMessageContainer();
    
    const streamer = new TextStreamer(generator.tokenizer, {
        skip_prompt: true,
        callback_function: (text) => {
            buffer += text;
            
            if (buffer.endsWith('</think>') || buffer.endsWith('\]')) {
                processCompleteResponse(buffer);
                buffer = '';
            } else {
                updatePartialText(buffer);
            }
        }
    });

    await generator(
        [{ role: 'user', content: prompt }],
        { 
            max_new_tokens: 2048,
            do_sample: false,
            streamer,
            return_dict_in_generate: true,
        }
    );
}

document.addEventListener('DOMContentLoaded', async () => {
    const spinner = document.getElementById('loading-spinner');
    
    try {
        spinner.classList.remove('spinner-hidden');
        await initModel();
    } catch (error) {
        console.error('Initialization failed:', error);
    } finally {
        spinner.classList.add('spinner-hidden');
    }
    
    sendBtn.addEventListener('click', handleSend);
    inputEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });
});
