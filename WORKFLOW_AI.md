# 🤖 Workflow AI Developer - Sweet Daisies Orchestra

## 🔄 **Processus de développement avec GenSpark AI**

### 📋 **Règles de travail :**

1. **🌿 Branches séparées OBLIGATOIRES**
   - ✅ `genspark_ai_developer` → Tous les développements AI
   - ✅ `main` → Production (merge manuel par le propriétaire)

2. **🔒 Sécurité du workflow :**
   - ❌ **JAMAIS** de push direct sur `main`
   - ✅ **TOUJOURS** créer une Pull Request
   - ✅ Validation manuelle avant merge

### 🚀 **Processus GenSpark AI :**

#### Étape 1 : Développement
```bash
# L'AI travaille sur genspark_ai_developer
git checkout genspark_ai_developer
git pull origin genspark_ai_developer
# ... modifications de code ...
git add .
git commit -m "feat: description des changements"
```

#### Étape 2 : Pull Request
```bash
# L'AI pousse les changements
git push origin genspark_ai_developer
# L'AI crée automatiquement une PR vers main
```

#### Étape 3 : Review & Merge (Manuel)
- 👤 **Propriétaire** : Review de la PR
- 👤 **Propriétaire** : Tests et validation
- 👤 **Propriétaire** : Merge vers `main`
- 🚀 **Cloudflare** : Auto-deployment depuis `main`

### 🎵 **Avantages pour Sweet Daisies Orchestra :**

- 🔒 **Sécurité** : Code de production protégé
- 🧪 **Tests** : Validation avant mise en ligne
- 📝 **Traçabilité** : Historique clair des changements
- 🎯 **Contrôle** : Vous gardez la main sur la production

---
*Workflow établi le 5 octobre 2024 - GenSpark AI Developer*