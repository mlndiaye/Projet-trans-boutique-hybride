# Generated by Django 5.0.8 on 2024-10-10 14:46

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id_category', models.AutoField(primary_key=True, serialize=False)),
                ('name_category', models.CharField(max_length=100)),
                ('description', models.TextField()),
            ],
        ),
    ]
