<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## 開発ワークフロー

この案件（産後ケアナビ改修）は、設計・タスク分解をClaude Codeで行い、実装はCodex CLIに委任する。Claude Codeは実装を直接書かず、delegate-to-codexスキル経由でCodexに投げ、生成された差分をレビューする形を基本とする。

設計・提案を行う前に、対象ファイルの `git log` と `git diff`（HEAD比較）を確認し、既存実装の現状を正確に把握してから設計する。特にこのプロジェクトは部分実装が既にある場合があるため、関連ファイルのコミット履歴を必ず確認してから提案すること（過去に、未コミットの巻き戻し差分を既存実装だと誤認したまま設計を進めてしまい、手戻りが発生した）。

Codexへの実装依頼は、ユーザーが明示的に指示・承認した変更点のみに限定する。UIのラベル文言・通知文・チェックボックスの構成など、指示に直接含まれない項目は「ついでに」変更・削除しない。設計提案の中で言及した内容であっても、ユーザーが個別に明確に承認していない限り実装に含めず、判断に迷う場合は実装前に確認する（過去に、居住地プルダウンの変更のみを依頼されたのに、チェックボックスの構成や通知文まで独自判断で変更してしまい、手戻りが発生した）。
