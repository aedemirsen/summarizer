# Summarizer - User Manual

Welcome to the **Summarizer**, a powerful Chrome extension designed to help you quickly summarize selected text on any webpage using advanced AI models. This manual provides a comprehensive guide to installing, configuring, and using the extension effectively.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Configuration](#configuration)
  - [Free Mode vs. Own API Keys](#free-mode-vs-own-api-keys)
  - [Setting Up API Keys](#setting-up-api-keys)
  - [Supported Models](#supported-models)
  - [Advanced Settings](#advanced-settings)
- [Usage Details](#usage-details)
  - [Dynamic Summary Length](#dynamic-summary-length)
  - [Text-to-Speech](#text-to-speech)
  - [Usage Limits and Billing](#usage-limits-and-billing)
- [Troubleshooting](#troubleshooting)
  - [Common Errors](#common-errors)
  - [Performance Issues](#performance-issues)
  - [API Key Issues](#api-key-issues)
- [Technical Information](#technical-information)
  - [Privacy and Security](#privacy-and-security)
  - [Browser Compatibility](#browser-compatibility)
  - [System Requirements](#system-requirements)
- [Contact and Support](#contact-and-support)

## Overview

Summarizer is a tool that leverages large language models (LLMs) to condense selected text into concise summaries. Whether you're reading articles, research papers, or long web content, this extension helps you save time by providing instant summaries directly on the page.

## Features

- **Instant Summaries**: Summarize selected text with a single click.
- **Dynamic Length**: Summary length adjusts based on the input text size.
- **Multiple AI Providers**: Use free mode with pre-configured models or your own API keys for providers like Groq, Gemini, and OpenAI.
- **Text-to-Speech**: Listen to summaries with adjustable playback controls.
- **Customization**: Choose output language, summary format (paragraph or bullet points), and UI language.
- **Usage Tracking**: Monitor daily usage limits in free mode.
- **Privacy Focused**: No storage of summarized content or browsing history.

## Installation

### Option 1: Chrome Web Store (Recommended)

1. Visit the [Chrome Web Store](https://chrome.google.com/webstore) (link to be updated once published).
2. Search for **Summarizer**.
3. Click **Add to Chrome** and confirm the installation.
4. The extension icon will appear in your Chrome toolbar.

### Option 2: Developer Mode (Manual Installation)

1. Clone or download the repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions`.
3. Enable **Developer mode** in the top right corner.
4. Click **Load unpacked** and select the `extension/` folder from the downloaded repository.
5. The extension will appear in your toolbar.

**Note**: Developer mode installations may require periodic manual updates.

## Basic Usage

1. **Select Text**: Highlight any text on a webpage.
2. **Open Summarizer**: A small button or context menu will appear near your selection. Click it to open the summarizer panel.
3. **Generate Summary**: The panel will display the AI-generated summary of your selected text.
4. **Interact with Summary**: Use the controls to read aloud, copy, or close the panel.

## Configuration

### Free Mode vs. Own API Keys

- **Free Mode**: Use pre-configured AI models (Groq and Gemini) without needing your own API keys. Limited to a daily usage quota (e.g., 20 summaries per provider per day).
- **Own API Keys**: Configure your personal API keys for providers like Groq, OpenAI, or Gemini to access unlimited summaries or specific models not available in free mode.

### Setting Up API Keys

1. Right-click the extension icon in the Chrome toolbar and select **Options**.
2. In the settings panel, choose your desired provider from the dropdown (e.g., `Groq`, `OpenAI`, `Gemini`).
3. Enter your API key for the selected provider.
4. Optionally, specify the model you wish to use (see supported models below).
5. Click **Save** to store the key securely (encrypted in Chrome storage).

**Where to get API keys**:
- **Groq**: Sign up at [groq.com](https://groq.com) and generate an API key in your dashboard.
- **OpenAI**: Register at [openai.com](https://openai.com) and obtain an API key from the API section.
- **Gemini**: Access API keys via [Google AI Studio](https://makersuite.google.com/app/apikey).

### Supported Models

- **Free Mode** (Pre-configured):
  - **Groq**: `llama-3.1-8b-instant`
  - **Gemini**: `gemini-2.5-flash`
- **Own API Keys** (Examples, may vary based on provider updates):
  - **Groq**: `llama-3.1-8b-instant`, `mixtral-8x7b-32768`
  - **OpenAI**: `gpt-3.5-turbo`, `gpt-4`
  - **Gemini**: `gemini-2.5-flash`, `gemini-1.5-pro`

**Note**: Ensure the model you select matches the provider and is accessible with your API key.

### Advanced Settings

- **Output Language**: Set the language of the summary (e.g., English, Turkish, German). Use `Auto` to match the input text's language.
- **Summary Format**: Toggle between paragraph format or bullet points.
- **UI Language**: Adjust the extension interface language (e.g., English, Turkish).
- **Bullet Summary**: Enable for bullet-point summaries instead of paragraphs.

To access these settings:
1. Right-click the extension icon.
2. Select **Options**.
3. Adjust the settings as needed and click **Save**.

## Usage Details

### Dynamic Summary Length

The length of the generated summary automatically adjusts based on the length of the selected text:
- **< 500 characters**: Very short summary (1-2 sentences or 3-5 bullet points).
- **500-1500 characters**: Short summary (2-4 sentences or 3-5 bullet points).
- **1500-3000 characters**: Medium summary (3-6 sentences or 5-8 bullet points).
- **> 3000 characters**: Detailed summary (5-8 sentences or 6-10 bullet points).

This ensures that longer texts receive more comprehensive summaries while short selections remain concise.

### Text-to-Speech

- **Read Aloud**: Click the speaker icon in the summary panel to listen to the summary.
- **Controls**: Use pause, resume, and stop buttons to control playback.
- **Language Detection**: The extension attempts to match the voice to the summary language (if supported by the browser).

### Usage Limits and Billing

- **Free Mode**: Limited to a daily quota per provider (e.g., 20 summaries per day for Groq and 20 for Gemini, independently). Usage is displayed in the summary panel (e.g., "5/20").
- **Own API Keys**: No extension-imposed limits; usage depends on your provider's quota and billing plan.
- **Subscription Mode**: Currently disabled in the UI but planned for future updates with premium features and higher limits.

## Troubleshooting

### Common Errors

- **"Daily Limit Reached" (Free Mode)**: You've exceeded the daily quota for the provider. Switch to another provider in free mode or configure your own API key.
- **"No Text Selected"**: Ensure text is highlighted before opening the summarizer.
- **"API Error"**: Check if the backend is running (in developer mode) or if your API key is valid.

### Performance Issues

- **Slow Summaries**: This may be due to high server load in free mode or network issues. Try using your own API key for potentially faster responses.
- **Extension Lag**: If the browser slows down, try restarting Chrome or disabling other extensions temporarily.

### API Key Issues

- **Invalid Key**: Double-check the key for typos. Ensure it matches the selected provider.
- **Quota Exceeded**: Your API key may have reached its limit on the provider's side. Check your provider dashboard for usage details.
- **Model Not Found**: Ensure the model you selected is still supported by the provider.

**Tip**: To reset or change API keys, revisit the **Options** page and update the settings.

## Technical Information

### Privacy and Security

- **Data Handling**: The extension does not store summarized content or browsing history. Only anonymous usage telemetry is sent to the backend (e.g., install ID, summary events).
- **API Keys**: Keys are stored encrypted in Chrome's secure storage (`chrome.storage.sync`).
- **Network**: Summarization requests are sent to the configured backend or directly to the AI provider (if using own keys).

### Browser Compatibility

- **Supported**: Chrome (Version 90+ recommended).
- **Not Supported**: Firefox, Safari, Edge (planned for future releases).

### System Requirements

- **OS**: Windows, macOS, Linux (any OS supported by Chrome).
- **Memory**: Minimal (runs within Chrome's resource allocation).
- **Internet**: Required for summarization (offline mode not supported).

## Contact and Support

- **Issues**: Report bugs or request features by contacting the developer via email (to be updated) or through the repository's issue tracker if available.
- **Feedback**: Your feedback helps improve the extension. Let us know about your experience or any desired features.

Thank you for using AI Text Summarizer! We hope this tool enhances your productivity and reading experience.
