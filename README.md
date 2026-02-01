# 75orDie
A website for students to track their attendance.

### Live Link
https://seven5ordie.onrender.com/

![preview_img_desktopview](https://github.com/cdhananjay/75orDie/raw/main/desktopview.png)

![preview_img_mobileview](https://github.com/cdhananjay/75orDie/raw/main/mobileview.png)

### Tech Stack
- Neon PostgreSQL
- Drizzle ORM
- Express
- React
- Typescript
- Tailwind CSS
- ShadCN UI

### Getting started
1. Clone repo
```
git clone https://github.com/cdhananjay/75orDie.git
cd 75orDie
```
2. Install dependencies
```
npm install
npm install --prefix client
```
3. Copy and fill env variables
```
cp example.env .env
# then edit .env
```
4. Run migrations
```
npx drizzle-kit generate
npx drizzle-kit migrate
```
5. Start development
```
npm run dev # or npm run dev:backend and then npm run dev:frontend
```

### Project Structure (pre-build)
```
75orDie/
├── client/
│   ├── src/
│   │   └──(frontend files .tsx ...) 
│   └── (frontend config files...)
├── src/        
│   └── (backend files .ts ...)
├── .env
└── (backend config files...)
```

### Project Structure (post-build)
```
75orDie/
├── client/
│   ├── dist/
│   │   └──(frontend files .html, .js, .css)
│   ├── src/
│   │   └──(frontend files .tsx ...) 
│   └── (frontend config files...)
├── server/        
│   └── (backend files .js ...)
├── src/        
│   └── (backend files .ts ...)
├── .env
└── (backend config files...)
```

### Cost
- Database: Neon free tier
- Hosting: Render Free tier

## Feel free to contribute!