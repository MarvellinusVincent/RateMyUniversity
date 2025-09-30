-- Create sequences
CREATE SEQUENCE IF NOT EXISTS public.users_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE SEQUENCE IF NOT EXISTS public.universities_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE SEQUENCE IF NOT EXISTS public.reviews_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE SEQUENCE IF NOT EXISTS public.refresh_tokens_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE SEQUENCE IF NOT EXISTS public.password_reset_tokens_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

-- Create tables
CREATE TABLE IF NOT EXISTS public.users
(
    id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_email_key UNIQUE (email)
);

CREATE TABLE IF NOT EXISTS public.universities
(
    id integer NOT NULL DEFAULT nextval('universities_id_seq'::regclass),
    name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    web_pages text[],
    alpha_two_code character(2),
    state_province text,
    domains text[],
    country text,
    CONSTRAINT universities_pkey PRIMARY KEY (id),
    CONSTRAINT universities_name_key UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS public.reviews
(
    id integer NOT NULL DEFAULT nextval('reviews_id_seq'::regclass),
    user_id integer,
    university_id integer NOT NULL,
    overall_rating integer,
    happiness_rating integer,
    academic_rating integer,
    professors_rating integer,
    difficulty_rating integer,
    opportunities_rating integer,
    social_life_rating integer,
    clubs_rating integer,
    athletics_rating integer,
    safety_rating integer,
    facilities_rating integer,
    internet_rating integer,
    location_rating integer,
    housing_rating integer,
    food_rating integer,
    transportation_rating integer,
    review_text text,
    comments text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    likes integer DEFAULT 0,
    university_name text NOT NULL,
    CONSTRAINT reviews_pkey PRIMARY KEY (id),
    CONSTRAINT reviews_university_id_fkey FOREIGN KEY (university_id)
        REFERENCES public.universities (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT reviews_academic_rating_check CHECK (academic_rating >= 1 AND academic_rating <= 5),
    CONSTRAINT reviews_athletics_rating_check CHECK (athletics_rating >= 1 AND athletics_rating <= 5),
    CONSTRAINT reviews_clubs_rating_check CHECK (clubs_rating >= 1 AND clubs_rating <= 5),
    CONSTRAINT reviews_difficulty_rating_check CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
    CONSTRAINT reviews_facilities_rating_check CHECK (facilities_rating >= 1 AND facilities_rating <= 5),
    CONSTRAINT reviews_food_rating_check CHECK (food_rating >= 1 AND food_rating <= 5),
    CONSTRAINT reviews_happiness_rating_check CHECK (happiness_rating >= 1 AND happiness_rating <= 5),
    CONSTRAINT reviews_housing_rating_check CHECK (housing_rating >= 1 AND housing_rating <= 5),
    CONSTRAINT reviews_internet_rating_check CHECK (internet_rating >= 1 AND internet_rating <= 5),
    CONSTRAINT reviews_location_rating_check CHECK (location_rating >= 1 AND location_rating <= 5),
    CONSTRAINT reviews_opportunities_rating_check CHECK (opportunities_rating >= 1 AND opportunities_rating <= 5),
    CONSTRAINT reviews_overall_rating_check CHECK (overall_rating >= 1 AND overall_rating <= 5),
    CONSTRAINT reviews_professors_rating_check CHECK (professors_rating >= 1 AND professors_rating <= 5),
    CONSTRAINT reviews_safety_rating_check CHECK (safety_rating >= 1 AND safety_rating <= 5),
    CONSTRAINT reviews_social_life_rating_check CHECK (social_life_rating >= 1 AND social_life_rating <= 5),
    CONSTRAINT reviews_transportation_rating_check CHECK (transportation_rating >= 1 AND transportation_rating <= 5)
);

CREATE TABLE IF NOT EXISTS public.review_likes
(
    user_id integer NOT NULL,
    review_id integer NOT NULL,
    CONSTRAINT review_likes_pkey PRIMARY KEY (user_id, review_id),
    CONSTRAINT review_likes_review_id_fkey FOREIGN KEY (review_id)
        REFERENCES public.reviews (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT review_likes_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.refresh_tokens
(
    id integer NOT NULL DEFAULT nextval('refresh_tokens_id_seq'::regclass),
    user_id integer NOT NULL,
    token text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id),
    CONSTRAINT refresh_tokens_token_key UNIQUE (token),
    CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.password_reset_tokens
(
    id integer NOT NULL DEFAULT nextval('password_reset_tokens_id_seq'::regclass),
    user_id integer NOT NULL,
    token text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id),
    CONSTRAINT password_reset_tokens_token_key UNIQUE (token),
    CONSTRAINT password_reset_tokens_user_id_key UNIQUE (user_id),
    CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS token_cleanup_log (
    id SERIAL PRIMARY KEY,
    reset_tokens_deleted INTEGER NOT NULL DEFAULT 0,
    refresh_tokens_deleted INTEGER NOT NULL DEFAULT 0,
    cleanup_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
    error_message TEXT NULL
);

-- Set sequence ownership
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
ALTER SEQUENCE public.universities_id_seq OWNED BY public.universities.id;
ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;
ALTER SEQUENCE public.refresh_tokens_id_seq OWNED BY public.refresh_tokens.id;
ALTER SEQUENCE public.password_reset_tokens_id_seq OWNED BY public.password_reset_tokens.id;


CREATE OR REPLACE FUNCTION update_likes_count_on_delete()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE reviews 
    SET likes = GREATEST(0, likes - 1) 
    WHERE id = OLD.review_id;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_likes_count_on_insert()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE reviews 
    SET likes = likes + 1 
    WHERE id = NEW.review_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_likes_on_delete
    AFTER DELETE ON review_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_likes_count_on_delete();

CREATE TRIGGER trigger_update_likes_on_insert
    AFTER INSERT ON review_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_likes_count_on_insert();

CREATE OR REPLACE FUNCTION public.like_review(
    p_user_id integer,
    p_review_id integer)
    RETURNS integer
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
    v_likes INTEGER;
    v_exists BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM review_likes 
        WHERE review_likes.user_id = p_user_id 
        AND review_likes.review_id = p_review_id
    ) INTO v_exists;
    IF v_exists THEN
        DELETE FROM review_likes 
        WHERE review_likes.user_id = p_user_id 
        AND review_likes.review_id = p_review_id;
    ELSE
        INSERT INTO review_likes (user_id, review_id) 
        VALUES (p_user_id, p_review_id);
    END IF;
    SELECT likes INTO v_likes
    FROM reviews 
    WHERE id = p_review_id;
    
    RETURN v_likes;
END;
$BODY$;

CREATE OR REPLACE FUNCTION cleanup_expired_tokens()
RETURNS TABLE(
    reset_tokens_deleted INTEGER,
    refresh_tokens_deleted INTEGER,
    cleanup_timestamp TIMESTAMP
) 
LANGUAGE plpgsql
AS $$
DECLARE
    reset_count INTEGER := 0;
    refresh_count INTEGER := 0;
BEGIN
    DELETE FROM password_reset_tokens 
    WHERE expires_at <= NOW();
    
    GET DIAGNOSTICS reset_count = ROW_COUNT;
    
    DELETE FROM refresh_tokens 
    WHERE created_at < NOW() - INTERVAL '7 days';
    
    GET DIAGNOSTICS refresh_count = ROW_COUNT;
    
    INSERT INTO token_cleanup_log (reset_tokens_deleted, refresh_tokens_deleted, cleanup_timestamp)
    VALUES (reset_count, refresh_count, NOW());
    
    RETURN QUERY SELECT reset_count, refresh_count, NOW()::TIMESTAMP;
END;
$$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at 
ON password_reset_tokens(expires_at);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_created_at 
ON refresh_tokens(created_at);



