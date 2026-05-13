import re

with open('portfolio/script.js', 'r') as f:
    content = f.read()

content = re.sub(
    r'    try \{\n        const backendResponse = await fetchWithRetry\(`\$\{API_BASE_URL\}/github-stats/`, \{\}, 1, 5000\);\n        const stats = await backendResponse\.json\(\);\n        setGitHubStats\(\n            stats\.public_repos \?\? \'—\',\n            stats\.total_stars \?\? \'—\',\n            stats\.followers \?\? \'—\',\n            stats\.contributions \?\? \'—\'\n        \);\n        return;\n    \} catch \(error\) \{\n        // Fallback to GitHub public API below\n    \}',
    '',
    content,
    flags=re.DOTALL
)

with open('portfolio/script.js', 'w') as f:
    f.write(content)
