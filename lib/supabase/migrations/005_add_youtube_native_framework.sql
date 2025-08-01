-- ================================
-- YouTube-Native Framework Migration
-- Adds advanced analytics and prediction fields
-- ================================

-- Add new fields to video_scripts table for YouTube-Native Framework
ALTER TABLE video_scripts ADD COLUMN IF NOT EXISTS framework_type VARCHAR(30) DEFAULT 'youtube_native';
ALTER TABLE video_scripts ADD COLUMN IF NOT EXISTS retention_score INTEGER DEFAULT 0;
ALTER TABLE video_scripts ADD COLUMN IF NOT EXISTS engagement_prediction JSONB;
ALTER TABLE video_scripts ADD COLUMN IF NOT EXISTS viral_factors JSONB;
ALTER TABLE video_scripts ADD COLUMN IF NOT EXISTS hook_strength INTEGER DEFAULT 0;
ALTER TABLE video_scripts ADD COLUMN IF NOT EXISTS narrative_flow_score INTEGER DEFAULT 0;
ALTER TABLE video_scripts ADD COLUMN IF NOT EXISTS algorithm_optimization_score INTEGER DEFAULT 0;

-- Add performance tracking fields
ALTER TABLE video_scripts ADD COLUMN IF NOT EXISTS predicted_retention DECIMAL(5,2) DEFAULT 0;
ALTER TABLE video_scripts ADD COLUMN IF NOT EXISTS predicted_engagement DECIMAL(5,2) DEFAULT 0;
ALTER TABLE video_scripts ADD COLUMN IF NOT EXISTS predicted_ctr DECIMAL(5,2) DEFAULT 0;
ALTER TABLE video_scripts ADD COLUMN IF NOT EXISTS confidence_level VARCHAR(10) DEFAULT 'medium';

-- Add YouTube-specific optimization data
ALTER TABLE video_scripts ADD COLUMN IF NOT EXISTS optimization_data JSONB;
ALTER TABLE video_scripts ADD COLUMN IF NOT EXISTS personalization_data JSONB;
ALTER TABLE video_scripts ADD COLUMN IF NOT EXISTS post_production_guidance JSONB;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_scripts_framework_type ON video_scripts(framework_type);
CREATE INDEX IF NOT EXISTS idx_scripts_retention_score ON video_scripts(retention_score DESC);
CREATE INDEX IF NOT EXISTS idx_scripts_predicted_retention ON video_scripts(predicted_retention DESC);
CREATE INDEX IF NOT EXISTS idx_scripts_hook_strength ON video_scripts(hook_strength DESC);

-- Create YouTube-Native analytics view
CREATE OR REPLACE VIEW youtube_native_analytics AS
SELECT 
    vs.id,
    vs.user_id,
    vs.script_type,
    vs.framework_type,
    vs.retention_score,
    vs.hook_strength,
    vs.narrative_flow_score,
    vs.algorithm_optimization_score,
    vs.predicted_retention,
    vs.predicted_engagement,
    vs.predicted_ctr,
    vs.confidence_level,
    vs.was_used,
    vs.created_at,
    vi.title as idea_title,
    vi.category as idea_category,
    COUNT(et.id) as total_engagements,
    AVG(CASE WHEN et.engagement_type = 'time_spent' THEN 
        CAST(et.engagement_value->>'time_spent' AS INTEGER) 
        ELSE NULL END) as avg_time_spent
FROM video_scripts vs
LEFT JOIN video_ideas vi ON vs.idea_id = vi.id
LEFT JOIN engagement_tracking et ON vs.idea_id = et.idea_id
WHERE vs.framework_type = 'youtube_native'
GROUP BY vs.id, vi.title, vi.category;

-- Function to calculate overall script quality score
CREATE OR REPLACE FUNCTION calculate_script_quality_score(
    hook_strength INTEGER,
    narrative_flow_score INTEGER,
    algorithm_optimization_score INTEGER
) RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN
    -- Weighted average: Hook 40%, Narrative 35%, Algorithm 25%
    RETURN ROUND(
        (hook_strength * 0.4 + 
         narrative_flow_score * 0.35 + 
         algorithm_optimization_score * 0.25)
    );
END;
$$;

-- Function to predict script performance based on YouTube-Native elements
CREATE OR REPLACE FUNCTION predict_youtube_performance(
    hook_strength INTEGER,
    narrative_score INTEGER,
    script_content JSONB,
    channel_data JSONB DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    base_retention DECIMAL := 50.0;
    base_engagement DECIMAL := 2.5;
    base_ctr DECIMAL := 4.0;
    
    hook_bonus DECIMAL;
    narrative_bonus DECIMAL;
    content_bonus DECIMAL;
    
    predicted_retention DECIMAL;
    predicted_engagement DECIMAL;
    predicted_ctr DECIMAL;
    
    confidence VARCHAR := 'medium';
BEGIN
    -- Calculate bonuses based on scores
    hook_bonus := (hook_strength - 50) * 0.5; -- Each point above 50 adds 0.5% retention
    narrative_bonus := (narrative_score - 50) * 0.3; -- Each point above 50 adds 0.3% retention
    
    -- Analyze content for engagement elements
    content_bonus := 0;
    IF script_content ? 'engagement_elements' THEN
        content_bonus := jsonb_array_length(script_content->'engagement_elements') * 2;
    END IF;
    
    -- Calculate predictions
    predicted_retention := GREATEST(0, LEAST(95, base_retention + hook_bonus + narrative_bonus));
    predicted_engagement := GREATEST(0, LEAST(15, base_engagement + (hook_bonus * 0.1) + content_bonus * 0.1));
    predicted_ctr := GREATEST(0, LEAST(20, base_ctr + (hook_strength - 50) * 0.05));
    
    -- Determine confidence level
    IF hook_strength >= 80 AND narrative_score >= 80 THEN
        confidence := 'high';
    ELSIF hook_strength <= 40 OR narrative_score <= 40 THEN
        confidence := 'low';
    END IF;
    
    RETURN jsonb_build_object(
        'predicted_retention', ROUND(predicted_retention, 2),
        'predicted_engagement', ROUND(predicted_engagement, 2),
        'predicted_ctr', ROUND(predicted_ctr, 2),
        'confidence_level', confidence,
        'calculated_at', NOW()
    );
END;
$$;

-- Function to analyze hook strength (simplified version)
CREATE OR REPLACE FUNCTION analyze_hook_strength(hook_text TEXT) RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
    score INTEGER := 50; -- Base score
    word_count INTEGER;
BEGIN
    IF hook_text IS NULL OR LENGTH(hook_text) = 0 THEN
        RETURN 0;
    END IF;
    
    word_count := array_length(string_to_array(hook_text, ' '), 1);
    
    -- Optimal length bonus (8-12 words)
    IF word_count >= 8 AND word_count <= 12 THEN
        score := score + 10;
    ELSIF word_count > 15 THEN
        score := score - 10;
    END IF;
    
    -- Pattern detection bonuses
    IF hook_text ~* '(o que.*não.*sabe|segredo|nunca.*contou|descobri)' THEN
        score := score + 15; -- Curiosity gap
    END IF;
    
    IF hook_text ~* '(todo mundo.*mas|todos.*pensam.*porém|contrário)' THEN
        score := score + 15; -- Contradiction
    END IF;
    
    IF hook_text ~* '(ontem|semana passada|anos atrás|aconteceu comigo)' THEN
        score := score + 15; -- Personal story
    END IF;
    
    IF hook_text ~* '(minutos para|aprenda.*em|como.*sem)' THEN
        score := score + 12; -- Benefit focused
    END IF;
    
    IF hook_text ~* '(agora|hoje|ainda|antes que)' THEN
        score := score + 8; -- Urgency
    END IF;
    
    RETURN GREATEST(0, LEAST(100, score));
END;
$$;

-- Trigger to auto-calculate scores when script is inserted/updated
CREATE OR REPLACE FUNCTION auto_calculate_script_scores()
RETURNS TRIGGER AS $$
DECLARE
    hook_text TEXT;
    calculated_hook_strength INTEGER;
    narrative_score INTEGER := 70; -- Default, will be enhanced with AI analysis
    performance_prediction JSONB;
BEGIN
    -- Extract hook text from content
    IF NEW.content ? 'hook' THEN
        hook_text := NEW.content->>'hook';
    ELSIF NEW.content ? 'hook_system' THEN
        hook_text := NEW.content->'hook_system'->>'primary';
    END IF;
    
    -- Calculate hook strength
    IF hook_text IS NOT NULL THEN
        calculated_hook_strength := analyze_hook_strength(hook_text);
        NEW.hook_strength := calculated_hook_strength;
    END IF;
    
    -- Set narrative flow score (simplified for now)
    NEW.narrative_flow_score := narrative_score;
    
    -- Calculate algorithm optimization score based on content structure
    NEW.algorithm_optimization_score := CASE 
        WHEN NEW.content ? 'engagement_elements' THEN 75
        WHEN NEW.content ? 'retention_optimization' THEN 80
        ELSE 60
    END;
    
    -- Calculate overall retention score
    NEW.retention_score := calculate_script_quality_score(
        COALESCE(NEW.hook_strength, 50),
        NEW.narrative_flow_score,
        NEW.algorithm_optimization_score
    );
    
    -- Generate performance predictions
    performance_prediction := predict_youtube_performance(
        COALESCE(NEW.hook_strength, 50),
        NEW.narrative_flow_score,
        NEW.content
    );
    
    NEW.predicted_retention := (performance_prediction->>'predicted_retention')::DECIMAL;
    NEW.predicted_engagement := (performance_prediction->>'predicted_engagement')::DECIMAL;
    NEW.predicted_ctr := (performance_prediction->>'predicted_ctr')::DECIMAL;
    NEW.confidence_level := performance_prediction->>'confidence_level';
    NEW.engagement_prediction := performance_prediction;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_auto_calculate_script_scores ON video_scripts;
CREATE TRIGGER trigger_auto_calculate_script_scores
    BEFORE INSERT OR UPDATE ON video_scripts
    FOR EACH ROW
    EXECUTE FUNCTION auto_calculate_script_scores();

-- Create function to get YouTube-Native performance summary
CREATE OR REPLACE FUNCTION get_youtube_native_performance_summary(user_id_param UUID)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    result JSONB;
    total_scripts INTEGER;
    avg_retention DECIMAL;
    avg_hook_strength DECIMAL;
    top_performing_scripts JSONB;
BEGIN
    -- Get basic stats
    SELECT COUNT(*), AVG(predicted_retention), AVG(hook_strength)
    INTO total_scripts, avg_retention, avg_hook_strength
    FROM video_scripts 
    WHERE user_id = user_id_param AND framework_type = 'youtube_native';
    
    -- Get top performing scripts
    SELECT jsonb_agg(
        jsonb_build_object(
            'id', vs.id,
            'retention_score', vs.retention_score,
            'predicted_retention', vs.predicted_retention,
            'hook_strength', vs.hook_strength,
            'idea_title', vi.title,
            'was_used', vs.was_used
        )
    )
    INTO top_performing_scripts
    FROM (
        SELECT vs.*, vi.title
        FROM video_scripts vs
        LEFT JOIN video_ideas vi ON vs.idea_id = vi.id
        WHERE vs.user_id = user_id_param 
        AND vs.framework_type = 'youtube_native'
        ORDER BY vs.retention_score DESC
        LIMIT 5
    ) vs_with_ideas;
    
    result := jsonb_build_object(
        'total_scripts', COALESCE(total_scripts, 0),
        'avg_retention', ROUND(COALESCE(avg_retention, 0), 2),
        'avg_hook_strength', ROUND(COALESCE(avg_hook_strength, 0), 2),
        'top_performing', COALESCE(top_performing_scripts, '[]'::jsonb),
        'generated_at', NOW()
    );
    
    RETURN result;
END;
$$;

-- Add comments for documentation
COMMENT ON TABLE video_scripts IS 'Enhanced with YouTube-Native Framework analytics and predictions';
COMMENT ON COLUMN video_scripts.framework_type IS 'Type of framework used: youtube_native or traditional';
COMMENT ON COLUMN video_scripts.retention_score IS 'Overall retention score (0-100) based on hook, narrative, and algorithm factors';
COMMENT ON COLUMN video_scripts.hook_strength IS 'Strength score of the hook (0-100) based on psychological triggers';
COMMENT ON COLUMN video_scripts.predicted_retention IS 'Predicted retention percentage based on YouTube-Native analysis';
COMMENT ON FUNCTION get_youtube_native_performance_summary IS 'Returns performance summary for YouTube-Native scripts of a user';

-- Grant permissions
GRANT SELECT ON youtube_native_analytics TO authenticated;
GRANT EXECUTE ON FUNCTION get_youtube_native_performance_summary TO authenticated;