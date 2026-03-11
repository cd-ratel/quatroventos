import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@quatroventos.com.br';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@2026!';
  const adminName = process.env.ADMIN_NAME || 'Administrador';

  const hashedPassword = await hash(adminPassword, 12);

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      password: hashedPassword,
    },
    create: {
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
    },
  });

  await prisma.settings.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      venueTitle: 'Quatro Ventos',
      venueSubtitle: 'Espaço para Eventos',
      phone: '(00) 00000-0000',
      email: 'contato@quatroventos.com.br',
      address: 'Rua Exemplo, 123 - Centro',
      whatsapp: '5500000000000',
      aboutText: 'O Quatro Ventos é o espaço perfeito para celebrar os momentos mais especiais da sua vida. Com ambientes sofisticados e uma equipe dedicada, transformamos seus sonhos em realidade.',
      businessHours: JSON.stringify({
        mon: { open: '09:00', close: '18:00' },
        tue: { open: '09:00', close: '18:00' },
        wed: { open: '09:00', close: '18:00' },
        thu: { open: '09:00', close: '18:00' },
        fri: { open: '09:00', close: '18:00' },
        sat: { open: '09:00', close: '14:00' },
        sun: null,
      }),
    },
  });

  console.log('✅ Seed completed successfully');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
