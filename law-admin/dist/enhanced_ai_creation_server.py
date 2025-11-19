#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
增强版AI创作API服务器
提供更丰富、专业的AI内容生成功能
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import random
from datetime import datetime, timedelta
import time
import re

app = Flask(__name__)
CORS(app, origins=['*'])

# 品牌数据库
brands_data = [
    {
        "id": 1,
        "name": "狗不理包子",
        "description": "天津传统小吃，历史悠久，皮薄馅大，口感鲜美",
        "category": "传统美食",
        "establishmentYear": 1858,
        "founder": "高贵友",
        "specialty": "皮薄馅大，十八个褶，口感鲜美",
        "imageUrl": "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Traditional%20Tianjin%20Goubuli%20baozi%20shop%2C%20vintage%20Chinese%20architecture%2C%20steaming%20baskets%20of%20dumplings%2C%20traditional%20atmosphere&image_size=landscape_16_9",
        "status": "ACTIVE",
        "rating": 4.5,
        "storyCount": 25,
        "followerCount": 1200,
        "culturalValue": "国家级非物质文化遗产",
        "craftsmanship": "传统手工制作工艺"
    },
    {
        "id": 2,
        "name": "耳朵眼炸糕",
        "description": "天津传统糕点，外酥内嫩，甜而不腻，是天津的特色小吃",
        "category": "传统糕点",
        "establishmentYear": 1900,
        "founder": "刘万春",
        "specialty": "外酥内嫩，甜而不腻，色泽金黄",
        "imageUrl": "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Traditional%20Tianjin%20Ear%20Eye%20fried%20cake%20shop%2C%20golden%20fried%20cakes%2C%20traditional%20Chinese%20sweet%20pastry%2C%20vintage%20atmosphere&image_size=landscape_16_9",
        "status": "ACTIVE",
        "rating": 4.3,
        "storyCount": 18,
        "followerCount": 890,
        "culturalValue": "天津市级非物质文化遗产",
        "craftsmanship": "传统油炸工艺"
    },
    {
        "id": 3,
        "name": "十八街麻花",
        "description": "天津传统糕点，制作精细，口感酥脆，是天津的著名特产",
        "category": "传统糕点",
        "establishmentYear": 1920,
        "founder": "范桂林",
        "specialty": "酥脆香甜，造型美观，层次分明",
        "imageUrl": "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Traditional%20Tianjin%20Eighteen%20Street%20twisted%20dough%20shop%2C%20golden%20twisted%20fried%20dough%2C%20traditional%20Chinese%20pastry%20making%2C%20craftsman%20at%20work&image_size=landscape_16_9",
        "status": "ACTIVE",
        "rating": 4.4,
        "storyCount": 22,
        "followerCount": 1050,
        "culturalValue": "天津传统名点",
        "craftsmanship": "传统麻花制作技艺"
    },
    {
        "id": 4,
        "name": "杨柳青年画",
        "description": "天津传统民间艺术，色彩鲜艳，题材丰富，是中国年画的重要流派",
        "category": "传统艺术",
        "establishmentYear": 1630,
        "founder": "民间艺人",
        "specialty": "色彩鲜艳，构图饱满，题材丰富",
        "imageUrl": "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Traditional%20Tianjin%20Yangliuqing%20New%20Year%20painting%20studio%2C%20colorful%20traditional%20Chinese%20paintings%2C%20artisans%20painting%2C%20cultural%20heritage&image_size=landscape_16_9",
        "status": "ACTIVE",
        "rating": 4.7,
        "storyCount": 35,
        "followerCount": 1800,
        "culturalValue": "国家级非物质文化遗产",
        "craftsmanship": "传统木版年画技艺"
    },
    {
        "id": 5,
        "name": "泥人张",
        "description": "天津传统泥塑艺术，造型生动，色彩丰富，是中国泥塑艺术的代表",
        "category": "传统艺术",
        "establishmentYear": 1826,
        "founder": "张明山",
        "specialty": "造型生动，色彩丰富，神形兼备",
        "imageUrl": "https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Traditional%20Tianjin%20Clay%20Figurine%20Zhang%20workshop%2C%20artisan%20sculpting%20colorful%20clay%20figures%2C%20traditional%20Chinese%20craftsmanship%2C%20cultural%20heritage&image_size=landscape_16_9",
        "status": "ACTIVE",
        "rating": 4.6,
        "storyCount": 28,
        "followerCount": 1500,
        "culturalValue": "国家级非物质文化遗产",
        "craftsmanship": "传统泥塑技艺"
    }
]

# AI创作模板
ai_creation_templates = {
    "STORY": {
        "templates": [
            "{brand_name}始创于{year}年，创始人{founder}{story_event}。{brand_name}作为{category}的代表，承载着{region}深厚的历史文化底蕴。",
            "在{year}年的{location}，{founder}创立了{brand_name}。这个{category}品牌以其{specialty}而闻名，成为了{region}文化的重要组成部分。",
            "{brand_name}的故事要从{year}年说起，那时的{founder}{founder_story}。经过{years}年的发展，{brand_name}已经成为了{category}领域的佼佼者。"
        ],
        "founder_stories": [
            "凭借精湛的技艺和对品质的执着追求",
            "怀着对传统文化的热爱和传承使命",
            "在艰苦的环境中坚持传统工艺",
            "不断创新，将传统与现代完美结合"
        ],
        "story_events": [
            "凭借对传统工艺的执着追求",
            "怀着传承文化的历史使命",
            "在商海沉浮中坚守品质",
            "历经岁月洗礼而初心不改"
        ]
    },
    "INTRODUCTION": {
        "templates": [
            "{brand_name}是{region}著名的{category}品牌，始创于{year}年。该品牌以其{specialty}而著称，{cultural_value}。",
            "作为{region}{category}的代表，{brand_name}始创于{year}年。创始人{founder}将{craftsmanship}发扬光大，使其成为了{region}文化的重要符号。",
            "{brand_name}，这个承载着{region}文化记忆的品牌，自{year}年创立以来，一直以其{specialty}而闻名遐迩。"
        ]
    },
    "CRAFT": {
        "templates": [
            "{brand_name}的制作工艺十分考究，需要经过{craft_steps}等多道工序。每一道工序都体现了{craftsmanship}的精髓。",
            "制作{brand_name}需要{craft_time}和{craft_materials}。整个制作过程体现了{founder}对品质的极致追求。",
            "{brand_name}的{craftsmanship}包括{craft_steps}等关键步骤。这些工艺技法代代相传，至今仍然保持着传统的韵味。"
        ],
        "craft_steps": [
            "选料、配料、制作、成型、装饰",
            "原料准备、初步加工、精细制作、质量检验",
            "传统工艺、现代技术、品质把控、包装出品"
        ],
        "craft_materials": [
            "精选的优质原料",
            "传统的制作工具",
            "独特的配方配比",
            "精湛的技艺手法"
        ]
    },
    "CULTURE": {
        "templates": [
            "{brand_name}不仅是一种{category}，更是{region}文化的重要载体。它承载着{historical_period}的历史记忆，体现了{cultural_connotation}。",
            "在{region}的文化长河中，{brand_name}如一颗璀璨的明珠。它见证了historical_changes，传承了cultural_spirit。",
            "{brand_name}蕴含着深厚的文化内涵，体现了{region}人民的{regional_characteristics}。这种文化精神在{modern_context}中依然闪耀着光芒。"
        ],
        "cultural_connotations": [
            "精益求精的工匠精神",
            "诚信为本的商业理念",
            "传承创新的文化态度",
            "和谐共生的处世哲学"
        ],
        "regional_characteristics": [
            "勤劳智慧、勇于创新",
            "诚实守信、精益求精",
            "开放包容、与时俱进",
            "传承文化、不忘初心"
        ]
    },
    "HISTORY": {
        "templates": [
            "从{year}年创立至今，{brand_name}已经走过了{years}年的风雨历程。在这{historical_period}中，它经历了{historical_events}。",
            "{brand_name}的历史可以追溯到{year}年。在这{years}年的发展历程中，它见证了{region}的变迁，承载了historical_memories。",
            "{founder}在{year}年创立{brand_name}时，可能没有想到这个品牌会在{years}年后成为{region}文化的重要符号。"
        ],
        "historical_events": [
            "战乱年代的艰难求生",
            "改革开放的创新发展",
            "新时代的转型升级",
            "文化传承的历史使命"
        ]
    },
    "MODERN": {
        "templates": [
            "进入新时代，{brand_name}在保持{traditional_features}的基础上，积极拥抱{modern_innovations}。",
            "面对现代市场的挑战，{brand_name}坚持{core_values}，同时融入{modern_elements}，展现出强大的生命力。",
            "在传承与创新的平衡中，{brand_name}找到了自己的发展道路。它既保持了{traditional_charm}，又具备了{modern_appeal}。"
        ],
        "modern_innovations": [
            "数字化生产技术",
            "现代营销理念",
            "品牌国际化战略",
            "可持续发展模式"
        ],
        "modern_elements": [
            "现代审美理念",
            "科技制作工艺",
            "互联网营销模式",
            "国际化发展视野"
        ]
    }
}

# AI模型配置
ai_models = [
    {
        "id": "text-generator-v2",
        "name": "智能文本生成器",
        "type": "TEXT_GENERATION",
        "description": "基于深度学习的专业文本内容生成模型，支持多种创作风格",
        "status": "AVAILABLE",
        "capabilities": ["故事创作", "产品介绍", "文化解读", "历史叙述"],
        "max_tokens": 2000,
        "temperature_range": [0.1, 1.0]
    },
    {
        "id": "cultural-ai",
        "name": "文化AI专家",
        "type": "CULTURAL_AI",
        "description": "专门用于传统文化内容创作和解读的AI模型",
        "status": "AVAILABLE", 
        "capabilities": ["文化解读", "历史考证", "传统工艺", "非遗传承"],
        "max_tokens": 1500,
        "temperature_range": [0.3, 0.8]
    },
    {
        "id": "story-teller",
        "name": "故事叙述者",
        "type": "STORY_TELLING",
        "description": "专业的品牌故事和历史文化叙述AI模型",
        "status": "AVAILABLE",
        "capabilities": ["品牌故事", "人物传记", "历史事件", "文化传承"],
        "max_tokens": 1800,
        "temperature_range": [0.4, 0.9]
    },
    {
        "id": "content-optimizer",
        "name": "内容优化师",
        "type": "CONTENT_OPTIMIZATION",
        "description": "智能内容优化和润色工具，提升文本质量",
        "status": "AVAILABLE",
        "capabilities": ["文本润色", "结构优化", "语言美化", "SEO优化"],
        "max_tokens": 1000,
        "temperature_range": [0.2, 0.6]
    }
]

def generate_brand_content(brand_data, creation_type, custom_prompt=""):
    """生成品牌相关内容"""
    if creation_type not in ai_creation_templates:
        return generate_generic_content(brand_data, creation_type, custom_prompt)
    
    template_data = {
        "brand_name": brand_data["name"],
        "founder": brand_data["founder"],
        "year": brand_data["establishmentYear"],
        "category": brand_data["category"],
        "specialty": brand_data["specialty"],
        "region": "天津",
        "cultural_value": brand_data.get("culturalValue", "传统文化的重要载体"),
        "craftsmanship": brand_data.get("craftsmanship", "传统手工技艺"),
        "years": datetime.now().year - brand_data["establishmentYear"],
        "historical_period": get_historical_period(brand_data["establishmentYear"]),
        "location": "天津",
        "craft_steps": random.choice(ai_creation_templates["CRAFT"]["craft_steps"]),
        "craft_materials": random.choice(ai_creation_templates["CRAFT"]["craft_materials"]),
        "cultural_connotation": random.choice(ai_creation_templates["CULTURE"]["cultural_connotations"]),
        "regional_characteristics": random.choice(ai_creation_templates["CULTURE"]["regional_characteristics"]),
        "historical_events": random.choice(ai_creation_templates["HISTORY"]["historical_events"]),
        "traditional_features": "传统工艺的精髓",
        "modern_innovations": random.choice(ai_creation_templates["MODERN"]["modern_innovations"]),
        "core_values": "品质至上，传承为本",
        "modern_elements": random.choice(ai_creation_templates["MODERN"]["modern_elements"]),
        "traditional_charm": "历史文化的深厚底蕴",
        "modern_appeal": "现代审美的时尚元素",
        "founder_story": random.choice(ai_creation_templates["STORY"]["founder_stories"]),
        "story_event": random.choice(ai_creation_templates["STORY"]["story_events"]),
        "historical_changes": "时代的变迁和社会的发展",
        "historical_memories": "珍贵的历史记忆",
        "cultural_spirit": "传承创新的文化精神",
        "modern_context": "现代社会的发展进程"
    }
    
    # 如果有自定义提示，进行智能融合
    if custom_prompt:
        template_data["custom_requirement"] = analyze_custom_prompt(custom_prompt, creation_type)
    
    # 选择并生成内容
    template = random.choice(ai_creation_templates[creation_type]["templates"])
    content = template.format(**template_data)
    
    # 后处理优化
    content = post_process_content(content, creation_type)
    
    return content

def analyze_custom_prompt(prompt, creation_type):
    """分析用户自定义提示"""
    prompt_lower = prompt.lower()
    
    # 提取关键词和意图
    keywords = {
        "detailed": "详细的" in prompt_lower or "详细" in prompt_lower,
        "simple": "简单" in prompt_lower or "简洁" in prompt_lower,
        "professional": "专业" in prompt_lower or "深度" in prompt_lower,
        "story": "故事" in prompt_lower or "经历" in prompt_lower,
        "history": "历史" in prompt_lower or "由来" in prompt_lower,
        "culture": "文化" in prompt_lower or "内涵" in prompt_lower,
        "craft": "工艺" in prompt_lower or "制作" in prompt_lower,
        "modern": "现代" in prompt_lower or "发展" in prompt_lower
    }
    
    return keywords

def post_process_content(content, creation_type):
    """内容后处理"""
    # 移除多余的空格和换行
    content = re.sub(r'\s+', ' ', content)
    content = re.sub(r'\n\s*\n', '\n\n', content)
    
    # 根据类型调整格式
    if creation_type == "STORY":
        content = add_story_elements(content)
    elif creation_type == "CRAFT":
        content = add_craft_details(content)
    elif creation_type == "CULTURE":
        content = add_cultural_depth(content)
    
    return content.strip()

def add_story_elements(content):
    """添加故事元素"""
    story_openings = [
        "在古老的天津卫，",
        "时光倒流到那个年代，",
        "这是一个关于传承的故事，",
        "在天津的大街小巷里，"
    ]
    
    story_endings = [
        "这就是{brand_name}的故事，一个关于传承与创新的传奇。",
        "岁月流转，{brand_name}的精神却历久弥新。",
        "这个故事，承载着天津人的记忆与情感。",
        "传承不息，创新不止，这就是{brand_name}的魅力所在。"
    ]
    
    if not content.startswith("在") and random.random() < 0.3:
        content = random.choice(story_openings) + content
    
    return content

def add_craft_details(content):
    """添加工艺细节"""
    craft_details = [
        "每一道工序都需要精湛的技艺",
        "制作过程中的温度和时间控制至关重要",
        "原料的选择直接影响最终的品质",
        "传统工艺的精髓在于细节的把握"
    ]
    
    if "工序" in content and random.random() < 0.4:
        detail = random.choice(craft_details)
        content = content.replace("工序", f"工序（{detail}）")
    
    return content

def add_cultural_depth(content):
    """添加文化深度"""
    cultural_quotes = [
        "这正体现了中华传统文化的深厚底蕴",
        "这种文化传承体现了中华民族的智慧",
        "在现代化的进程中，这样的文化瑰宝显得尤为珍贵",
        "文化的力量在于传承，传承的意义在于发展"
    ]
    
    if random.random() < 0.3:
        quote = random.choice(cultural_quotes)
        content += f"\n\n{quote}，{content.split('。')[-2] if '。' in content else '这种文化精神'}值得我们深入思考和传承发扬。"
    
    return content

def get_historical_period(year):
    """获取历史时期"""
    if year < 1644:
        return "明朝末年"
    elif year < 1912:
        return "清朝时期"
    elif year < 1949:
        return "民国时期"
    elif year < 1978:
        return "新中国初期"
    else:
        return "改革开放时期"

def generate_generic_content(brand_data, creation_type, custom_prompt):
    """生成通用内容"""
    return f"{brand_data['name']}是{brand_data['category']}领域的知名品牌，始创于{brand_data['establishmentYear']}年。{custom_prompt or '这是一个关于传承与创新的故事。'}"

# API端点
@app.route('/api/ai/models')
def get_ai_models():
    """获取AI模型列表 - 增强版"""
    return jsonify(ai_models)

@app.route('/api/ai/creations', methods=['POST'])
def create_ai_creation():
    """创建AI内容 - 增强版"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "请求数据不能为空"}), 400
        
        brand_id = data.get('brandId')
        brand_name = data.get('brandName', '')
        creation_type = data.get('creationType', 'STORY')
        ai_model = data.get('aiModel', 'text-generator-v2')
        prompt = data.get('prompt', '')
        
        # 查找品牌数据
        brand_data = None
        if brand_id:
            brand_data = next((b for b in brands_data if b['id'] == brand_id), None)
        
        if not brand_data:
            return jsonify({"error": "品牌不存在"}), 404
        
        # 模拟AI处理时间
        processing_time = random.uniform(1.5, 3.0)
        time.sleep(processing_time)
        
        # 生成内容
        content = generate_brand_content(brand_data, creation_type, prompt)
        
        # 生成标题
        title = generate_title(brand_data, creation_type)
        
        # 计算置信度
        confidence = calculate_confidence(content, creation_type)
        
        # 生成相关标签
        tags = generate_tags(brand_data, creation_type)
        
        # 生成摘要
        summary = generate_summary(content)
        
        # 生成关键词
        keywords = generate_keywords(content)
        
        # 生成阅读时间预估
        reading_time = estimate_reading_time(content)
        
        result = {
            "taskId": f"task_{int(time.time())}_{random.randint(1000, 9999)}",
            "status": "COMPLETED",
            "processingTime": round(processing_time, 2),
            "result": {
                "title": title,
                "content": content,
                "summary": summary,
                "type": creation_type,
                "aiModel": ai_model,
                "confidence": confidence,
                "tags": tags,
                "keywords": keywords,
                "readingTime": reading_time,
                "wordCount": len(content),
                "characteristics": get_content_characteristics(content, creation_type),
                "suggestions": get_improvement_suggestions(content, creation_type),
                "relatedTopics": get_related_topics(brand_data, creation_type)
            },
            "brandInfo": {
                "id": brand_data["id"],
                "name": brand_data["name"],
                "category": brand_data["category"],
                "culturalValue": brand_data.get("culturalValue", "")
            },
            "createTime": datetime.now().isoformat(),
            "qualityScore": calculate_quality_score(content, creation_type)
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            "error": "AI创作失败",
            "message": str(e),
            "suggestion": "请检查输入参数或稍后重试"
        }), 500

def generate_title(brand_data, creation_type):
    """生成标题"""
    title_templates = {
        "STORY": [
            f"{brand_data['name']}的传奇故事：传承百年的文化记忆",
            f"穿越时光的{brand_data['name']}：{brand_data['founder']}的创业传奇",
            f"{brand_data['name']}的故事：{get_historical_period(brand_data['establishmentYear'])}的文化印记"
        ],
        "INTRODUCTION": [
            f"{brand_data['name']}：{brand_data['category']}的璀璨明珠",
            f"品味{brand_data['name']}：感受{brand_data['category']}的独特魅力",
            f"{brand_data['name']}品牌介绍：传统与现代的完美融合"
        ],
        "CRAFT": [
            f"揭秘{brand_data['name']}制作工艺：传统技艺的传承之路",
            f"{brand_data['name']}制作技艺：{brand_data['craftsmanship']}的精髓",
            f"匠心独运：{brand_data['name']}传统制作工艺解析"
        ],
        "CULTURE": [
            f"{brand_data['name']}的文化内涵：{brand_data['category']}中的文化符号",
            f"品味文化：{brand_data['name']}承载的历史记忆",
            f"{brand_data['name']}：{brand_data['culturalValue']}的生动体现"
        ],
        "HISTORY": [
            f"{brand_data['name']}的历史传承：从{brand_data['establishmentYear']}年走来的文化记忆",
            f"岁月如歌：{brand_data['name']}{get_historical_period(brand_data['establishmentYear'])}的历史印记",
            f"{brand_data['name']}的发展历程：见证时代变迁的文化符号"
        ],
        "MODERN": [
            f"{brand_data['name']}的现代发展：传统品牌的新时代之路",
            f"传承与创新：{brand_data['name']}在现代社会中的蜕变",
            f"{brand_data['name']}：传统技艺与现代理念的完美结合"
        ]
    }
    
    templates = title_templates.get(creation_type, [f"{brand_data['name']}：精彩内容"])
    return random.choice(templates)

def calculate_confidence(content, creation_type):
    """计算置信度"""
    base_confidence = 0.75
    
    # 根据内容长度调整
    if len(content) > 500:
        base_confidence += 0.1
    elif len(content) < 100:
        base_confidence -= 0.1
    
    # 根据类型调整
    type_multipliers = {
        "STORY": 1.0,
        "INTRODUCTION": 0.95,
        "CRAFT": 0.9,
        "CULTURE": 0.85,
        "HISTORY": 0.9,
        "MODERN": 0.95
    }
    
    confidence = base_confidence * type_multipliers.get(creation_type, 1.0)
    return min(confidence, 0.95)  # 最大0.95

def generate_tags(brand_data, creation_type):
    """生成标签"""
    base_tags = [brand_data["category"], "天津传统文化", "老字号品牌"]
    
    type_tags = {
        "STORY": ["品牌故事", "历史文化", "传承发展"],
        "INTRODUCTION": ["品牌介绍", "产品特色", "文化内涵"],
        "CRAFT": ["传统工艺", "制作技艺", "工匠精神"],
        "CULTURE": ["文化内涵", "非遗传承", "文化价值"],
        "HISTORY": ["历史传承", "发展历程", "时代变迁"],
        "MODERN": ["现代发展", "传承创新", "新时代"]
    }
    
    tags = base_tags + type_tags.get(creation_type, [])
    
    # 添加品牌特色标签
    if "非遗" in brand_data.get("culturalValue", ""):
        tags.append("非物质文化遗产")
    
    return list(set(tags))  # 去重

def generate_summary(content):
    """生成摘要"""
    # 取前200字符作为摘要，确保完整性
    summary = content[:200]
    if len(content) > 200:
        # 找到最后一个完整的句子
        last_period = summary.rfind('。')
        if last_period > 100:
            summary = summary[:last_period + 1]
        else:
            summary = summary + "..."
    
    return summary

def generate_keywords(content):
    """生成关键词"""
    # 简单的关键词提取
    keywords = ["天津", "传统文化", "老字号", "品牌故事"]
    
    # 从内容中提取重要词汇
    important_words = ["传承", "创新", "历史", "文化", "工艺", "品质", "发展"]
    found_words = [word for word in important_words if word in content]
    
    keywords.extend(found_words)
    return list(set(keywords))[:8]  # 最多8个关键词

def estimate_reading_time(content):
    """估算阅读时间"""
    # 假设平均阅读速度为每分钟300字
    words = len(content)
    minutes = max(1, words // 300)
    return f"{minutes}分钟"

def get_content_characteristics(content, creation_type):
    """获取内容特征"""
    return {
        "style": get_content_style(content, creation_type),
        "tone": get_content_tone(content, creation_type),
        "complexity": get_content_complexity(content),
        "originality": get_content_originality(content)
    }

def get_content_style(content, creation_type):
    """获取内容风格"""
    styles = {
        "STORY": "叙述性",
        "INTRODUCTION": "说明性",
        "CRAFT": "技术性",
        "CULTURE": "文化性",
        "HISTORY": "历史性",
        "MODERN": "现代性"
    }
    return styles.get(creation_type, "综合性")

def get_content_tone(content, creation_type):
    """获取内容语调"""
    if creation_type == "STORY":
        return "温暖亲切"
    elif creation_type == "CULTURE":
        return "庄重典雅"
    elif creation_type == "MODERN":
        return "活力创新"
    else:
        return "专业权威"

def get_content_complexity(content):
    """获取内容复杂度"""
    if len(content) > 800:
        return "高"
    elif len(content) > 400:
        return "中"
    else:
        return "低"

def get_content_originality(content):
    """获取内容原创度"""
    # 基于内容长度和独特性评估
    if len(content) > 600 and len(set(content)) > len(content) * 0.7:
        return "高"
    elif len(content) > 300:
        return "中"
    else:
        return "基础"

def get_improvement_suggestions(content, creation_type):
    """获取改进建议"""
    suggestions = []
    
    if len(content) < 200:
        suggestions.append("可以增加更多细节描述，让内容更加丰富")
    
    if "。" not in content or content.count("。") < 3:
        suggestions.append("建议增加更多段落分隔，提高可读性")
    
    if creation_type == "STORY" and "故事" not in content:
        suggestions.append("故事类内容可以增加更多情节元素")
    
    if creation_type == "CRAFT" and ("工艺" not in content or "制作" not in content):
        suggestions.append("工艺类内容可以详细描述制作过程")
    
    if not suggestions:
        suggestions.append("内容质量良好，继续保持")
    
    return suggestions

def get_related_topics(brand_data, creation_type):
    """获取相关主题"""
    topics = []
    
    # 基础相关主题
    base_topics = [
        f"{brand_data['category']}文化",
        "天津传统文化",
        "老字号品牌发展",
        "非物质文化遗产保护"
    ]
    
    # 类型相关主题
    type_topics = {
        "STORY": ["品牌传承故事", "创业历史", "人物传记"],
        "INTRODUCTION": ["品牌文化", "产品特色", "市场定位"],
        "CRAFT": ["传统技艺", "工匠精神", "工艺传承"],
        "CULTURE": ["文化内涵", "历史价值", "文化保护"],
        "HISTORY": ["历史变迁", "时代发展", "文化传承"],
        "MODERN": ["创新发展", "现代转型", "品牌建设"]
    }
    
    topics.extend(base_topics)
    topics.extend(type_topics.get(creation_type, []))
    
    return list(set(topics))[:6]  # 最多6个相关主题

def calculate_quality_score(content, creation_type):
    """计算内容质量分数"""
    score = 75  # 基础分数
    
    # 长度评分
    if len(content) > 500:
        score += 10
    elif len(content) > 300:
        score += 5
    
    # 完整性评分
    if "。" in content and content.count("。") >= 3:
        score += 5
    
    # 类型相关性评分
    type_scores = {
        "STORY": 5,
        "INTRODUCTION": 3,
        "CRAFT": 4,
        "CULTURE": 6,
        "HISTORY": 4,
        "MODERN": 3
    }
    score += type_scores.get(creation_type, 0)
    
    return min(score, 100)  # 最高100分

# 其他API端点保持不变
@app.route('/api/health')
def health_check():
    """健康检查"""
    return jsonify({
        "status": "UP",
        "timestamp": datetime.now().isoformat(),
        "service": "Jinmai AI Creation API",
        "version": "2.0.0",
        "features": ["AI内容生成", "多模型支持", "智能优化"]
    })

# 其他端点代码保持不变...

if __name__ == '__main__':
    print("🚀 启动津脉智坊增强版AI创作API服务器...")
    print("📋 AI模型已加载:", len(ai_models))
    print("📋 品牌数据已加载:", len(brands_data))
    print("📋 创作模板已加载:", len(ai_creation_templates))
    print("✨ 服务器启动成功！")
    
    app.run(host='0.0.0.0', port=8080, debug=False)