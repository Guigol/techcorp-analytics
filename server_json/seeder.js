const { faker } = require('@faker-js/faker');
const fs = require('fs');

// ===== CONFIGURATION CENTRALISÉE =====
const CONFIG = {
    // Quantités
    departments: 5,
    users: 66,
    tools: 24,

    // Budget et analytics
    budget: {
        monthly_limit: 30000,
        current_month: "2025-08",
        target_cost_per_user: 168
    },

    // Distribution utilisateurs par département (Engineering, Design, Marketing, Operations, Communication)
    departmentDistribution: [25, 8, 6, 12, 15],

    // Répartition des statuts d'outils
    toolStatusWeights: [
        { weight: 70, value: 'active' },
        { weight: 17, value: 'unused' },
        { weight: 13, value: 'expiring' }
    ],

    // Pourcentage d'utilisateurs inactifs par département
    inactiveUsersRatio: 0.05, // 5%

    // Nombre d'outils "récents" pour le dashboard
    recentToolsCount: 8
};

// ===== DONNÉES STATIQUES =====
const DEPARTMENT_DATA = [
    { name: 'Engineering', description: 'Software development and technical operations' },
    { name: 'Design', description: 'User experience and visual design' },
    { name: 'Marketing', description: 'Growth, content, and brand marketing' },
    { name: 'Operations', description: 'Business operations and project management' },
    { name: 'Communication', description: 'Internal and external communications' }
];

const TOOLS_DATA = [
    // Outils populaires avec icônes et coûts réalistes
    { name: "Slack", category: "Communication", vendor: "Slack Technologies", base_cost: 2450, users_range: [200, 250], icon: 'https://a.slack-edge.com/80588/marketing/img/icons/icon_slack_hash_colored.png' },
    { name: "Figma", category: "Design", vendor: "Figma Inc", base_cost: 480, users_range: [25, 35], icon: 'https://static.figma.com/app/icon/1/favicon.png' },
    { name: "GitHub", category: "Development", vendor: "Microsoft", base_cost: 890, users_range: [80, 95], icon: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png' },
    { name: "Notion", category: "Productivity", vendor: "Notion Labs", base_cost: 780, users_range: [140, 160], icon: 'https://www.notion.so/images/favicon.ico' },
    { name: "Adobe Creative Cloud", category: "Design", vendor: "Adobe", base_cost: 720, users_range: [10, 15], icon: 'https://www.adobe.com/content/dam/cc/icons/creative-cloud.svg' },
    { name: "Jira", category: "Project Management", vendor: "Atlassian", base_cost: 650, users_range: [45, 55], icon: 'https://wac-cdn.atlassian.com/dam/jcr:e348b562-4152-4cdc-8a55-3d297e509cc8/Jira%20Software-blue.svg' },
    { name: "Zoom", category: "Communication", vendor: "Zoom Video", base_cost: 420, users_range: [60, 70], icon: 'https://d24cgw3uvb9a9h.cloudfront.net/static/93516/image/new/ZoomLogo_112x112.png' },
    { name: "Office 365", category: "Productivity", vendor: "Microsoft", base_cost: 1200, users_range: [50, 60], icon: 'https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4OsXp' },
    { name: "Canva", category: "Design", vendor: "Canva", base_cost: 180, users_range: [15, 25], icon: 'https://static.canva.com/web/images/8439b51bb7a19f6e65ce1064bc37c197.png' },
    { name: "HubSpot", category: "Sales & Marketing", vendor: "HubSpot", base_cost: 950, users_range: [20, 30], icon: 'https://www.hubspot.com/hubfs/assets/hubspot.com/style-guide/brand-guidelines/hubspot-logo-black.svg' }
];

const ADDITIONAL_CATEGORIES = ["Analytics", "Development", "Project Management", "Security", "HR", "Finance"];
const FREQUENCIES = ['daily', 'weekly', 'monthly', 'rarely'];
const PROFICIENCIES = ['beginner', 'intermediate', 'advanced', 'expert'];

// ===== CLASSE PRINCIPALE =====
class DataSeeder {
    constructor() {
        this.departments = [];
        this.users = [];
        this.tools = [];
        this.userTools = [];
        this.analytics = {};
    }

    // ===== DÉPARTEMENTS =====
    generateDepartments() {
        console.log('🏢 Génération des départements...');

        this.departments = DEPARTMENT_DATA.map((dept, index) => ({
            id: index + 1,
            name: dept.name,
            description: dept.description,
            created_at: faker.date.between({
                from: '2024-01-01',
                to: '2024-06-01'
            }).toISOString(),
            updated_at: faker.date.between({
                from: '2025-08-10',
                to: new Date()
            }).toISOString()
        }));
    }

    // ===== UTILISATEURS =====
    generateUsers() {
        console.log('👥 Génération des utilisateurs...');
        let userId = 1;

        CONFIG.departmentDistribution.forEach((count, deptIndex) => {
            const departmentId = deptIndex + 1;
            const inactiveCount = Math.floor(count * CONFIG.inactiveUsersRatio);

            for (let i = 0; i < count; i++) {
                const isActive = i >= inactiveCount;
                const joinDate = faker.date.between({
                    from: '2023-01-01',
                    to: '2025-07-01'
                });

                this.users.push({
                    id: userId++,
                    name: faker.person.fullName(),
                    email: faker.internet.email().toLowerCase(),
                    department_id: departmentId,
                    role: this.generateRole(deptIndex, i === 0),
                    active: isActive,
                    joined_at: joinDate.toISOString().split('T')[0]
                });
            }
        });
    }

    generateRole(deptIndex, isHead) {
        if (isHead) return `Head of ${DEPARTMENT_DATA[deptIndex].name}`;

        const rolesByDept = {
            0: ['Senior Developer', 'Frontend Developer', 'Backend Developer', 'DevOps Engineer', 'Tech Lead', 'QA Engineer'],
            1: ['UX Designer', 'UI Designer', 'Product Designer', 'Design Lead', 'Visual Designer'],
            2: ['Marketing Manager', 'Content Creator', 'Growth Hacker', 'Brand Manager', 'Digital Marketer'],
            3: ['Operations Manager', 'Project Manager', 'Business Analyst', 'Process Specialist', 'Admin Coordinator'],
            4: ['Communications Manager', 'PR Manager', 'Social Media Manager', 'Content Writer', 'Community Manager']
        };

        return faker.helpers.arrayElement(rolesByDept[deptIndex]);
    }

    // ===== OUTILS =====
    generateTools() {
        console.log('🛠️ Génération des outils...');

        // Outils populaires (10 premiers)
        const popularTools = TOOLS_DATA.map((toolData, index) =>
            this.createTool(toolData, index + 1, true)
        );

        // Outils génériques supplémentaires (14 outils)
        const additionalTools = [];
        for (let i = 0; i < (CONFIG.tools - TOOLS_DATA.length); i++) {
            const category = faker.helpers.arrayElement(ADDITIONAL_CATEGORIES);
            const genericTool = {
                name: faker.company.name() + " " + category,
                category: category,
                vendor: faker.company.name(),
                base_cost: faker.number.int({ min: 100, max: 1500 }),
                users_range: [faker.number.int({ min: 5, max: 30 }), faker.number.int({ min: 31, max: 80 })],
                icon: `https://logo.clearbit.com/${faker.company.name().toLowerCase().replace(/\s+/g, '')}.com`
            };

            additionalTools.push(this.createTool(genericTool, TOOLS_DATA.length + i + 1, false));
        }

        this.tools = [...popularTools, ...additionalTools];
    }

    createTool(toolData, id, isPopular) {
        const activeUsers = faker.number.int({ min: toolData.users_range[0], max: toolData.users_range[1] });

        // Coûts avec variations
        const costVariation = faker.number.float({ min: 0.85, max: 1.15 });
        const monthlyCost = Math.round(toolData.base_cost * costVariation);
        const previousMonthCost = Math.round(monthlyCost * faker.number.float({ min: 0.88, max: 1.12 }));

        // Statut basé sur usage
        let status = faker.helpers.weightedArrayElement(CONFIG.toolStatusWeights);
        if (activeUsers < 5) status = "unused";

        // Date récente pour les N premiers outils (Recent Tools)
        const isRecent = id <= CONFIG.recentToolsCount;
        const updatedAt = isRecent
            ? faker.date.between({ from: '2025-07-25', to: new Date() })
            : faker.date.between({ from: '2024-06-01', to: '2025-07-24' });

        return {
            id,
            name: toolData.name,
            description: this.generateToolDescription(toolData.name),
            vendor: toolData.vendor,
            category: toolData.category,
            monthly_cost: monthlyCost,
            previous_month_cost: previousMonthCost,
            owner_department: faker.helpers.arrayElement(DEPARTMENT_DATA).name,
            status: status,
            website_url: `https://${toolData.name.toLowerCase().replace(/\s+/g, '')}.com`,
            active_users_count: activeUsers,
            icon_url: toolData.icon,
            created_at: faker.date.between({
                from: '2024-01-01',
                to: '2025-06-01'
            }).toISOString(),
            updated_at: updatedAt.toISOString()
        };
    }

    generateToolDescription(name) {
        const descriptions = {
            'Slack': 'Team messaging and collaboration platform',
            'GitHub': 'Version control and code collaboration platform',
            'Figma': 'Collaborative design and prototyping tool',
            'Notion': 'All-in-one workspace for notes, docs, and project management',
            'Adobe Creative Cloud': 'Creative suite for design and video editing',
            'Jira': 'Project management and issue tracking for agile teams',
            'Zoom': 'Video conferencing and online meeting platform',
            'Office 365': 'Productivity suite with Office apps and cloud services',
            'Canva': 'Online design and visual content creation platform',
            'HubSpot': 'CRM and marketing automation platform'
        };

        return descriptions[name] || `${faker.company.buzzPhrase()} solution`;
    }

    // ===== RELATIONS UTILISATEUR-OUTILS =====
    generateUserTools() {
        console.log('🔗 Génération des relations utilisateurs-outils...');

        // Pour chaque outil, assigner des utilisateurs selon active_users_count
        this.tools.forEach(tool => {
            const targetUsers = Math.min(tool.active_users_count, this.users.filter(u => u.active).length);
            const candidateUsers = this.users.filter(u => u.active);
            const selectedUsers = faker.helpers.arrayElements(candidateUsers, targetUsers);

            selectedUsers.forEach(user => {
                const frequency = faker.helpers.arrayElement(FREQUENCIES);

                this.userTools.push({
                    user_id: user.id,
                    tool_id: tool.id,
                    usage_frequency: frequency,
                    last_used: this.generateLastUsedDate(frequency),
                    proficiency_level: faker.helpers.arrayElement(PROFICIENCIES)
                });
            });
        });
    }

    generateLastUsedDate(frequency) {
        const now = new Date();
        const daysAgoMap = { daily: 1, weekly: 7, monthly: 30, rarely: 90 };
        const maxDaysAgo = daysAgoMap[frequency] || 7;

        const pastDate = new Date(now);
        pastDate.setDate(now.getDate() - faker.number.int({ min: 0, max: maxDaysAgo }));
        return pastDate.toISOString();
    }

    // ===== ANALYTICS ET BUDGET =====
    generateAnalytics() {
        console.log('📊 Génération des analytics...');

        const totalCurrentCost = this.tools.reduce((sum, tool) => sum + tool.monthly_cost, 0);
        const totalPreviousCost = this.tools.reduce((sum, tool) => sum + tool.previous_month_cost, 0);
        const activeUsersCount = this.users.filter(u => u.active).length;

        const costPerUser = Math.round(totalCurrentCost / activeUsersCount);
        const previousCostPerUser = Math.round(totalPreviousCost / activeUsersCount);

        this.analytics = {
            budget_overview: {
                monthly_limit: CONFIG.budget.monthly_limit,
                current_month_total: totalCurrentCost,
                previous_month_total: totalPreviousCost,
                budget_utilization: ((totalCurrentCost / CONFIG.budget.monthly_limit) * 100).toFixed(1),
                trend_percentage: (((totalCurrentCost - totalPreviousCost) / totalPreviousCost) * 100).toFixed(1)
            },
            kpi_trends: {
                budget_change: `${totalCurrentCost > totalPreviousCost ? '+' : ''}${(((totalCurrentCost - totalPreviousCost) / totalPreviousCost) * 100).toFixed(0)}%`,
                tools_change: `+${faker.number.int({ min: 5, max: 15 })}`,
                departments_change: "+2",
                cost_per_user_change: `${costPerUser > previousCostPerUser ? '+' : '-'}€${Math.abs(costPerUser - previousCostPerUser)}`
            },
            cost_analytics: {
                cost_per_user: costPerUser,
                previous_cost_per_user: previousCostPerUser,
                active_users: activeUsersCount,
                total_users: this.users.length
            }
        };
    }

    // ===== EXPORT =====
    exportData() {
        console.log('💾 Export des données...');

        const data = {
            departments: this.departments,
            users: this.users,
            tools: this.tools,
            user_tools: this.userTools,
            analytics: this.analytics
        };

        fs.writeFileSync('generated_data.json', JSON.stringify(data, null, 2));
        this.displayStats();
    }

    displayStats() {
        console.log('\n📊 DONNÉES GÉNÉRÉES:');
        console.log(`• Départements: ${this.departments.length}`);
        console.log(`• Utilisateurs: ${this.users.length} (${this.users.filter(u => u.active).length} actifs)`);
        console.log(`• Outils: ${this.tools.length} (${CONFIG.recentToolsCount} récents)`);
        console.log(`• Relations: ${this.userTools.length}`);
        console.log(`💰 Budget: €${this.analytics.budget_overview.current_month_total} / €${CONFIG.budget.monthly_limit}`);
        console.log(`📈 Utilisation: ${this.analytics.budget_overview.budget_utilization}%`);
        console.log('\n💾 Fichier généré: generated_data.json');
    }

    // ===== MÉTHODE PRINCIPALE =====
    async generate() {
        console.log('🌱 Démarrage du seeder SaaS Tools Dashboard...\n');

        this.generateDepartments();
        this.generateUsers();
        this.generateTools();
        this.generateUserTools();
        this.generateAnalytics();
        this.exportData();

        console.log('\n✅ Seeder terminé avec succès!');
    }
}

// ===== EXÉCUTION =====
if (require.main === module) {
    const seeder = new DataSeeder();
    seeder.generate().catch(console.error);
}

module.exports = DataSeeder;
