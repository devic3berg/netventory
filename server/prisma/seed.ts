import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const deviceModelsData = [
  {
    name: 'Cisco Catalyst 2960-X',
    description: '24-port managed switch with PoE+',
    priority: 4,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
  },
  {
    name: 'HP Aruba 2530-48G',
    description: '48-port Layer 2 managed switch',
    priority: 3,
    imageUrl: 'https://images.unsplash.com/photo-1629654358792-dfb53ba5c1a9?w=400&h=300&fit=crop'
  },
  {
    name: 'Netgear ProSafe GS748T',
    description: '48-port Smart managed switch',
    priority: 2,
    imageUrl: 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=400&h=300&fit=crop'
  },
  {
    name: 'D-Link DGS-3120-24TC',
    description: '24-port Layer 3 managed switch',
    priority: 4,
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'
  },

  {
    name: 'ASUS ROG Strix B550-F Gaming',
    description: 'ATX motherboard for AMD AM4',
    priority: 5,
    imageUrl: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=300&fit=crop'
  },
  {
    name: 'MSI MPG Z790 Carbon WiFi',
    description: 'ATX motherboard for Intel LGA1700',
    priority: 5,
    imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop'
  },
  {
    name: 'Gigabyte B450M DS3H',
    description: 'Micro-ATX motherboard for AMD AM4',
    priority: 3,
    imageUrl: 'https://images.unsplash.com/photo-1518946222227-364f22132616?w=400&h=300&fit=crop'
  },
  {
    name: 'ASRock H610M-HVS',
    description: 'Micro-ATX motherboard for Intel LGA1700',
    priority: 2,
    imageUrl: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=300&fit=crop'
  },
 
  {
    name: 'NVIDIA GeForce RTX 4080',
    description: 'High-performance graphics card 16GB GDDR6X',
    priority: 5,
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop'
  },
  {
    name: 'AMD Radeon RX 7800 XT',
    description: 'Gaming graphics card 16GB GDDR6',
    priority: 5,
    imageUrl: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&h=300&fit=crop'
  },
  {
    name: 'NVIDIA GeForce GTX 1660 Super',
    description: 'Mid-range graphics card 6GB GDDR6',
    priority: 3,
    imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=300&fit=crop'
  },
  {
    name: 'AMD Radeon RX 6600',
    description: '8GB GDDR6 graphics card for 1080p gaming',
    priority: 3,
    imageUrl: 'https://images.unsplash.com/photo-1587202372634-32705e3f6015?w=400&h=300&fit=crop'
  },
  
  // Processors
  {
    name: 'Intel Core i9-13900K',
    description: '24-core processor LGA1700',
    priority: 5,
    imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop'
  },
  {
    name: 'AMD Ryzen 9 7950X',
    description: '16-core processor AM5',
    priority: 5,
    imageUrl: 'https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=300&fit=crop'
  },
  {
    name: 'Intel Core i5-12600K',
    description: '10-core processor LGA1700',
    priority: 4,
    imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop'
  },
  {
    name: 'AMD Ryzen 5 5600X',
    description: '6-core processor AM4',
    priority: 4,
    imageUrl: 'https://images.unsplash.com/photo-1518946222227-364f22132616?w=400&h=300&fit=crop'
  },
  {
    name: 'Intel Core i3-12100',
    description: '4-core processor LGA1700',
    priority: 2,
    imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&h=300&fit=crop'
  }
];

const clientsData = [
  { firstName: 'John', lastName: 'Smith', email: 'john.smith@techcorp.com', priority: 3 },
  { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@innovate.com', priority: 4 },
  { firstName: 'Michael', lastName: 'Brown', email: 'michael.brown@digital.com', priority: 2 },
  { firstName: 'Emily', lastName: 'Davis', email: 'emily.davis@techcorp.com', priority: 5 },
  { firstName: 'David', lastName: 'Wilson', email: 'david.wilson@systems.com', priority: 3 },
  { firstName: 'Lisa', lastName: 'Martinez', email: 'lisa.martinez@innovate.com', priority: 4 },
  { firstName: 'Robert', lastName: 'Anderson', email: 'robert.anderson@solutions.com', priority: 2 },
  { firstName: 'Jennifer', lastName: 'Taylor', email: 'jennifer.taylor@digital.com', priority: 3 }
];

function generateSerialNumber(modelName: string, index: number): string {
  const prefix = modelName.split(' ')[0].substring(0, 3).toUpperCase();
  return `${prefix}${String(index).padStart(6, '0')}`;
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

const repairReasons = [
  'Device not powering on',
  'Component overheating',
  'Physical damage',
  'Performance issues',
  'Strange noises during operation',
  'Ports not working',
  'Connection problems',
  'Display artifacts',
  'Blue screen errors',
  'Device freezing'
];

const orderReasons = [
  'Staff expansion',
  'Replacing outdated equipment',
  'New branch opening',
  'Workstation upgrade',
  'Backup equipment needed',
  'New project requires additional resources'
];

async function main() {
  console.log('Starting extended database seed...');

  const hashedAdminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@rma-tool.com' },
    update: {},
    create: {
      email: 'admin@rma-tool.com',
      password: hashedAdminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      priority: 5,
    },
  });

  const createdModels: any[] = [];
  for (const modelData of deviceModelsData) {
    const model = await prisma.deviceModel.upsert({
      where: { name: modelData.name },
      update: {},
      create: modelData,
    });
    createdModels.push(model);
  }

  const createdClients: any[] = [];
  for (const clientData of clientsData) {
    const hashedPassword = await bcrypt.hash('client123', 10);
    const client = await prisma.user.upsert({
      where: { email: clientData.email },
      update: {},
      create: {
        ...clientData,
        password: hashedPassword,
        role: 'CLIENT',
      },
    });
    createdClients.push(client);
  }

  let deviceCounter = 1;
  const createdDevices: any[] = [];

  for (const client of createdClients) {
    const deviceCount = Math.floor(Math.random() * 4) + 2;
    
    for (let i = 0; i < deviceCount; i++) {
      const randomModel = getRandomElement(createdModels);
      const device = await prisma.device.create({
        data: {
          serialNumber: generateSerialNumber(randomModel.name, deviceCounter),
          status: 'ACTIVE' as const,
          userId: client.id,
          modelId: randomModel.id,
        },
      });
      createdDevices.push(device);
      deviceCounter++;
    }
  }

  const requestTypes: ('REPAIR' | 'REPLACEMENT' | 'ORDER')[] = ['REPAIR', 'REPLACEMENT', 'ORDER'];
  const requestStatuses: ('NEW' | 'IN_REVIEW' | 'DECLINED' | 'IN_DELIVERY' | 'SENT' | 'COMPLETED')[] = ['NEW', 'IN_REVIEW', 'DECLINED', 'IN_DELIVERY', 'SENT', 'COMPLETED'];
  
  for (let i = 0; i < 30; i++) {
    const randomClient = getRandomElement(createdClients);
    const requestType = getRandomElement(requestTypes);
    
    let requestData: any = {
      type: requestType,
      status: getRandomElement(requestStatuses),
      userId: randomClient.id,
      priority: randomClient.priority,
    };

    if (requestType === 'REPAIR' || requestType === 'REPLACEMENT') {
      const clientDevices = createdDevices.filter((d: any) => d.userId === randomClient.id);
      if (clientDevices.length > 0) {
        const randomDevice = getRandomElement(clientDevices);
        requestData.deviceId = randomDevice.id;
        requestData.reason = getRandomElement(repairReasons);
        
        if (requestType === 'REPLACEMENT') {
          requestData.replacementRequested = true;
          requestData.newSerialNumber = generateSerialNumber('REP', i + 1000);
        }
      } else {
        continue;
      }
    } else if (requestType === 'ORDER') {
      requestData.reason = getRandomElement(orderReasons);
      requestData.quantity = Math.floor(Math.random() * 5) + 1;
    }

    await prisma.request.create({
      data: requestData,
    });
  }

  console.log('Database seeded successfully!');
  console.log('Admin credentials: admin@rma-tool.com / admin123');
  console.log('Client credentials: [any client email] / client123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });