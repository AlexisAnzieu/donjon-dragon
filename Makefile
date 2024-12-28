dev:
	@echo "Starting development server..."
	@npm run dev

studio:
	@echo "Starting prisma studio..."
	@npm run prisma:studio

migrate:
	@echo "Migrating database..."
	@npm run prisma:migrate
