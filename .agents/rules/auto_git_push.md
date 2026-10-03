# Auto Git Push Rule

Whenever any code, data, or configuration changes are made in this repository based on user requests:
1. Immediately stage all changes: `git add .`
2. Create a meaningful commit: `git commit -m "<clear description of changes>"`
3. Push immediately to GitHub: `git push origin main`

Do not wait for the user to ask "push to github" - perform the commit and push automatically as part of completing each task.
