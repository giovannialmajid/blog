-- Posts table
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content_md TEXT,
  content_html TEXT,
  featured_image TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Metadata table
CREATE TABLE metadata (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE PRIMARY KEY,
  seo_title TEXT,
  seo_description TEXT,
  og_image TEXT,
  tags TEXT[] DEFAULT '{}'
);

-- Affiliate Links table
CREATE TABLE affiliate_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  merchant TEXT DEFAULT 'mercadolivre' CHECK (merchant IN ('mercadolivre', 'amazon', 'outros')),
  affiliate_url TEXT NOT NULL,
  display_text TEXT,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table
CREATE TABLE settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  site_title TEXT NOT NULL DEFAULT 'Neksti Reviews',
  site_description TEXT,
  analytics_id TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (id = 1) -- ensures only one row
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Posts: readable by public if published, all access to auth users
CREATE POLICY "Public profiles are viewable by everyone." ON posts FOR SELECT USING (status = 'published');
CREATE POLICY "Authenticated users can do anything with posts." ON posts FOR ALL USING (auth.role() = 'authenticated');

-- Metadata: readable by public if post is published
CREATE POLICY "Public metadata are viewable by everyone." ON metadata FOR SELECT USING (
  EXISTS (SELECT 1 FROM posts WHERE posts.id = metadata.post_id AND posts.status = 'published')
);
CREATE POLICY "Authenticated users can do anything with metadata." ON metadata FOR ALL USING (auth.role() = 'authenticated');

-- Affiliate Links: readable by public if post is published
CREATE POLICY "Public affiliate links are viewable by everyone." ON affiliate_links FOR SELECT USING (
  EXISTS (SELECT 1 FROM posts WHERE posts.id = affiliate_links.post_id AND posts.status = 'published')
);
CREATE POLICY "Authenticated users can do anything with affiliate links." ON affiliate_links FOR ALL USING (auth.role() = 'authenticated');

-- Settings: readable by public
CREATE POLICY "Settings are viewable by everyone." ON settings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can do anything with settings." ON settings FOR ALL USING (auth.role() = 'authenticated');

-- Indexes
CREATE INDEX idx_posts_slug ON posts(slug);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_metadata_tags ON metadata USING GIN(tags);
