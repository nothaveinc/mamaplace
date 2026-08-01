<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## 開発ワークフロー

この案件（産後ケアナビ改修）は、設計・タスク分解をClaude Codeで行い、実装はCodex CLIに委任する。Claude Codeは実装を直接書かず、delegate-to-codexスキル経由でCodexに投げ、生成された差分をレビューする形を基本とする。
