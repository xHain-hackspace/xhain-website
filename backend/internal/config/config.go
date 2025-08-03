package config

import (
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

type Config struct {
	Server struct {
		Port          int    `yaml:"port"`
		Host          string `yaml:"host"`
		StaticContent string `yaml:"static_content"`
	} `yaml:"server"`
	Calendar struct {
		URL             string `yaml:"url"`
		CacheTTLMinutes int    `yaml:"cache_ttl_minutes"`
		MonthsToShow    int    `yaml:"months_to_show"`
	} `yaml:"calendar"`
	Logging struct {
		Level  string `yaml:"level"`
		Format string `yaml:"format"`
	} `yaml:"logging"`
}

func LoadConfig(configPath string) (*Config, error) {
	configData, err := os.ReadFile(configPath)
	if err != nil {
		return nil, fmt.Errorf("failed to read config file: %w", err)
	}

	config := &Config{}
	if err := yaml.Unmarshal(configData, config); err != nil {
		return nil, fmt.Errorf("failed to parse config file: %w", err)
	}

	return config, nil
}
